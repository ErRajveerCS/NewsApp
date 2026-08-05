export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type?.startsWith("image/")) {
    return Response.json({ error: "Only image uploads are allowed" }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return Response.json(
      { error: "Image must be under 2MB (images are stored directly in the database)" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  return Response.json({ ok: true, url: dataUrl });
}
