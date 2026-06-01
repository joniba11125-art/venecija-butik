import { NextResponse } from "next/server";
import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

type ReservationEmailPayload = {
  productCode: string | null;
  productName: string;
  selectedSize: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  address?: string | null;
};

function createAdminEmail(payload: ReservationEmailPayload) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h1>Nova rezervacija</h1>
      <p>Stigla je nova rezervacija iz Venecija Butik webshopa.</p>

      <h2>Proizvod</h2>
      <p><strong>Naziv:</strong> ${payload.productName}</p>
      <p><strong>Šifra artikla:</strong> ${payload.productCode || "-"}</p>
      <p><strong>Veličina:</strong> ${payload.selectedSize || "-"}</p>

      <h2>Kupac</h2>
      <p><strong>Ime:</strong> ${payload.firstName} ${payload.lastName}</p>
      <p><strong>Adresa:</strong> ${payload.address || "Nije unesena"}</p>
      <p><strong>Telefon:</strong> ${payload.phone}</p>
      <p><strong>Email:</strong> ${payload.email}</p>

      <h2>Poruka</h2>
      <p>${payload.message || "-"}</p>
    </div>
  `;
}

function createCustomerEmail(payload: ReservationEmailPayload) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h1>Rezervacija je zaprimljena</h1>

      <p>Poštovana/i ${payload.firstName},</p>

      <p>Hvala na rezervaciji. Zaprimili smo vaš zahtjev i uskoro ćemo vas kontaktirati za potvrdu.</p>

      <h2>Detalji rezervacije</h2>
      <p><strong>Proizvod:</strong> ${payload.productName}</p>
      <p><strong>Šifra artikla:</strong> ${payload.productCode || "-"}</p>
      <p><strong>Veličina:</strong> ${payload.selectedSize || "-"}</p>

      <p style="margin-top: 24px;">Venecija Butik</p>
    </div>
  `;
}

export async function POST(request: Request) {
  const resend = getResendClient();

  if (!resend) {
    return NextResponse.json(
      { error: "RESEND_API_KEY nije podešen." },
      { status: 500 }
    );
  }

  try {
    const payload = (await request.json()) as ReservationEmailPayload;

    const adminEmails = (process.env.ADMIN_EMAIL || "")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Venecija Butik <onboarding@resend.dev>";

    if (adminEmails.length === 0) {
      return NextResponse.json(
        { error: "ADMIN_EMAIL nije podešen." },
        { status: 500 }
      );
    }

    if (!payload.email || !payload.productName) {
      return NextResponse.json(
        { error: "Nedostaju podaci za email." },
        { status: 400 }
      );
    }

    const results = {
      adminSent: false,
      customerSent: false,
      adminError: null as string | null,
      customerError: null as string | null,
    };

    const adminResult = await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      subject: `Nova rezervacija: ${payload.productName}`,
      html: createAdminEmail(payload),
    });

    if (adminResult.error) {
      console.error("Greška pri slanju admin emaila:", {
        adminEmails,
        error: adminResult.error,
      });
      results.adminError = adminResult.error.message;
    } else {
      results.adminSent = true;
    }

    const customerResult = await resend.emails.send({
      from: fromEmail,
      to: payload.email,
      bcc: adminEmails,
      subject: `Potvrda rezervacije - Venecija Butik`,
      html: createCustomerEmail(payload),
    });

    if (customerResult.error) {
      console.error("Greška pri slanju customer emaila:", customerResult.error);
      results.customerError = customerResult.error.message;
    } else {
      results.customerSent = true;
    }

    if (!results.adminSent && !results.customerSent) {
      return NextResponse.json(
        { error: "Email nije poslan.", results },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Greška pri slanju emaila:", error);

    return NextResponse.json(
      { error: "Email nije poslan." },
      { status: 500 }
    );
  }
}
