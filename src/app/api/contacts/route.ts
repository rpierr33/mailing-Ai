import { NextRequest, NextResponse } from "next/server";
import { getContacts, getContact, addContact, deleteContact, updateContact } from "@/lib/db";
import { contactCreateSchema } from "@/lib/validations";
import { requireAuth, pickAllowed } from "@/lib/auth-guard";
import type { Contact } from "@/types";

const CONTACT_PATCH_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "tags",
  "rating",
  "source",
  "location",
  "notes",
] as const;

export async function GET() {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const contacts = await getContacts(user.id);
  return NextResponse.json({ contacts });
}

export async function POST(request: NextRequest) {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const parsed = contactCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const contact = await addContact({
      firstName: data.firstName,
      lastName: data.lastName ?? null,
      email: data.email,
      phone: data.phone ?? null,
      tags: data.tags ?? [],
      rating: data.rating ?? 3,
      source: data.source ?? "Manual",
      location: data.location ?? null,
      notes: data.notes ?? null,
      userId: user.id,
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const target = await getContact(id);
  if (!target || target.userId !== user.id) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  const deleted = await deleteContact(id);
  if (!deleted) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const target = await getContact(id);
    if (!target || target.userId !== user.id) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const body = await request.json();
    const patch = pickAllowed(body, CONTACT_PATCH_FIELDS) as Partial<Contact>;
    const contact = await updateContact(id, patch);

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ contact });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
