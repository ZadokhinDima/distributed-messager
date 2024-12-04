package org.messager.messagerreader.api;

import lombok.RequiredArgsConstructor;
import org.messager.messagerreader.dto.ChatDto;
import org.messager.messagerreader.dto.GetMessagesRequest;
import org.messager.messagerreader.dto.GetMessagesResponse;
import org.messager.messagerreader.dto.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReaderController {

    private final ReaderService readerService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserDto> getUser(@PathVariable String userId) {
        return ResponseEntity.ok(readerService.getUser(userId));
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<ChatDto> getChat(@PathVariable String chatId) {
        return ResponseEntity.ok(readerService.getChat(chatId));
    }

    @GetMapping("/chat/{chatId}/messages/{count}")
    public ResponseEntity<GetMessagesResponse> getMessages(@PathVariable String chatId,
                                                           @RequestHeader("userId") String userId,
                                                           @PathVariable int count) {
        return ResponseEntity.ok(readerService.getMessages(chatId, userId, count));
    }
}
