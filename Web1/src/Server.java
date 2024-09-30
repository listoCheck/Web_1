import com.fastcgi.FCGIInterface;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class Server {
    public static void main(String[] args) {
        long startTime = System.currentTimeMillis();
        FCGIInterface fcgiInterface = new FCGIInterface();

        while(fcgiInterface.FCGIaccept() >= 0) {
            try {
                String requestBody = readRequestBody();
                String content = makeAnswer(requestBody);
                long endTime = System.currentTimeMillis();
                content = content + "," + (endTime - startTime);
                String httpResponse = "HTTP/1.1 200 OK\nContent-Type: text/html\nContent-Length: %d\n\n%s\n".formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
                FCGIInterface.request.outStream.write(httpResponse.getBytes(StandardCharsets.UTF_8));
            } catch (IOException var9) {
                var9.printStackTrace();
            }
        }

    }

    private static String makeAnswer(String body) {
        double x = Double.parseDouble(body.split("&")[0].split("=")[1]);
        double y = Double.parseDouble(body.split("&")[1].split("=")[1]);
        double r = Double.parseDouble(body.split("&")[2].split("=")[1]);
        return "" + x + "," + y + "," + r + "," + checkPoint(x, y, r);
    }

    private static boolean checkPoint(double x, double y, double r) {
        if (x <= 0 && y >= 0 && x * x + y * y <= r * r) {
            return true;
        } else if (x <= 0 && y <= 0 && y >= -x - r / 2) {
            return true;
        } else {
            return x >= 0 && y <= 0 && x <= r / 2 && y >= -r;
        }
    }

    private static String readRequestBody() throws IOException {
        FCGIInterface.request.inStream.fill();
        int contentLength = FCGIInterface.request.inStream.available();
        ByteBuffer buffer = ByteBuffer.allocate(contentLength);
        int readBytes = FCGIInterface.request.inStream.read(buffer.array(), 0, contentLength);
        byte[] requestBodyRaw = new byte[readBytes];
        buffer.get(requestBodyRaw);
        buffer.clear();
        return new String(requestBodyRaw, StandardCharsets.UTF_8);
    }
}
