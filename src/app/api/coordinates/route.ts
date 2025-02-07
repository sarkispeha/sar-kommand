import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      let isStreamClosed = false;

      const sendCoordinates = async () => {
        if (isStreamClosed) return;

        try {
          const coordinates = await db.memberCoord.findMany({
            orderBy: { id: "desc" },
            take: 100,
          });

          // Check if stream is still open before enqueueing
          if (!isStreamClosed) {
            controller.enqueue(`data: ${JSON.stringify(coordinates)}\n\n`);
          }
        } catch (error) {
          console.error("Error fetching coordinates:", error);
          if (!isStreamClosed) {
            controller.close();
            isStreamClosed = true;
          }
        }
      };

      // Send initial data
      await sendCoordinates();

      // Poll for new data every 2 seconds
      const interval = setInterval(async () => {
        if (!isStreamClosed) {
          await sendCoordinates();
        } else {
          clearInterval(interval);
        }
      }, 2000);

      // Cleanup on close
      return () => {
        isStreamClosed = true;
        clearInterval(interval);
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
