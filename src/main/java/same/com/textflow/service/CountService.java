package same.com.textflow.service;

import org.springframework.stereotype.Service;
import same.com.textflow.dto.request.CountRequest;
import same.com.textflow.dto.response.CountResponse;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@Service
public class CountService {

    private static final int TWITTER_LIMIT = 140;
    private static final int INSTAGRAM_LIMIT = 2200;
    private static final int MANUSCRIPT_CHARS = 400;

    public CountResponse count(CountRequest request) {
        String text = request.getText();
        if (text == null) {
            text = "";
        }

        int totalChars = text.length();
        int totalCharsWithoutSpace = text.replaceAll("\\s", "").length();
        int bytes = text.getBytes(StandardCharsets.UTF_8).length;
        int lines = text.isEmpty() ? 0 : text.split("\n", -1).length;
        int words = countWords(text);
        int paragraphs = countParagraphs(text);
        int manuscripts = (int) Math.ceil((double) totalChars / MANUSCRIPT_CHARS);

        return CountResponse.builder()
                .totalChars(totalChars)
                .totalCharsWithoutSpace(totalCharsWithoutSpace)
                .bytes(bytes)
                .lines(lines)
                .words(words)
                .paragraphs(paragraphs)
                .manuscripts(manuscripts)
                .twitterRemaining(Math.max(0, TWITTER_LIMIT - totalChars))
                .instagramRemaining(Math.max(0, INSTAGRAM_LIMIT - totalChars))
                .build();
    }

    private int countWords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }
        // Split by whitespace and count non-empty elements
        String[] words = text.trim().split("\\s+");
        return (int) Arrays.stream(words)
                .filter(w -> !w.isEmpty())
                .count();
    }

    private int countParagraphs(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }
        // Split by one or more blank lines
        String[] paragraphs = text.split("\n\\s*\n");
        return (int) Arrays.stream(paragraphs)
                .filter(p -> !p.trim().isEmpty())
                .count();
    }
}
