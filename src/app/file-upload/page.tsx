import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function uploadGpx(formData: FormData) {
  "use server";

  const file = formData.get("gpx") as File;
  const memberId = parseInt(formData.get("memberId") as string);

  if (!file) {
    throw new Error("No file uploaded");
  }

  const bytes = await file.arrayBuffer();

  const gpxFile = await db.gpxFile.create({
    data: {
      filename: file.name,
      fileData: Buffer.from(bytes),
      memberId: memberId,
    },
  });

  return { success: true };
}

export default function FileUploadPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        action={uploadGpx}
        className="flex flex-col space-y-4 p-6 border rounded-lg shadow-md w-96"
      >
        <input
          type="text"
          name="memberId"
          required
          className="border rounded px-3 py-2"
          placeholder="Member ID"
        />
        <input
          type="file"
          name="gpx"
          accept=".gpx"
          required
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Upload GPX
        </button>
      </form>
    </div>
  );
}
