# Gračanica · Lukavac · Tuzla Template - novi klijent

Ovo je osnovni template za butik webshop / online katalog.

## Za svakog novog klijenta treba:

1. Kopirati ovaj folder.
2. Napraviti novi GitHub repo.
3. Napraviti novi Supabase projekat.
4. Napraviti iste tabele i bucket u Supabase-u.
5. Ubaciti nove env varijable u `.env.local`.
6. Napraviti novi Vercel projekat.
7. Ubaciti iste env varijable u Vercel.
8. Povezati domenu.
9. Promijeniti logo, naziv butika, lokaciju, društvene mreže i boje.

## Env varijable

Kopirati `.env.example` u `.env.local` i popuniti:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
ADMIN_EMAIL=
RESEND_FROM_EMAIL=

## Supabase

Svaki klijent treba svoj Supabase projekat.

Potrebne tabele:
- products
- product_images
- reservations
- reviews
- site_settings
- staff_members
- staff_activity_logs
- daily_staff_notes
- admins
- product_categories

Storage bucket:
- product-images

## Deployment

Na Vercel importovati GitHub repo i dodati env varijable.
