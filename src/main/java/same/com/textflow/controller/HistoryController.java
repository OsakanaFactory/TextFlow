package same.com.textflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import same.com.textflow.dto.request.HistoryRequest;
import same.com.textflow.dto.request.ImportRequest;
import same.com.textflow.dto.response.HistoryDetailResponse;
import same.com.textflow.dto.response.HistoryResponse;
import same.com.textflow.dto.response.ImportResponse;
import same.com.textflow.service.HistoryService;

@RestController
@RequestMapping("/api/histories")
@RequiredArgsConstructor
@Tag(name = "History", description = "履歴管理API")
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping
    @Operation(summary = "履歴一覧取得", description = "ユーザーの履歴一覧を取得します")
    public ResponseEntity<Page<HistoryResponse>> getHistories(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<HistoryResponse> histories;
        if (search != null && !search.isEmpty()) {
            histories = historyService.searchHistories(userDetails.getUsername(), search, pageable);
        } else {
            histories = historyService.getHistories(userDetails.getUsername(), pageable);
        }

        return ResponseEntity.ok(histories);
    }

    @PostMapping
    @Operation(summary = "履歴保存", description = "新しい履歴を保存します")
    public ResponseEntity<HistoryResponse> createHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody HistoryRequest request) {
        HistoryResponse response = historyService.createHistory(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "履歴詳細取得", description = "履歴の詳細を取得します")
    public ResponseEntity<HistoryDetailResponse> getHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        HistoryDetailResponse response = historyService.getHistory(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "履歴削除", description = "履歴を削除します")
    public ResponseEntity<Void> deleteHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        historyService.deleteHistory(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    @Operation(summary = "履歴インポート", description = "localStorageからの履歴をインポートします")
    public ResponseEntity<ImportResponse> importHistories(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ImportRequest request) {
        ImportResponse response = historyService.importHistories(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }
}
