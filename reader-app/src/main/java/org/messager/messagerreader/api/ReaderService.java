package org.messager.messagerreader.api;

import lombok.RequiredArgsConstructor;
import org.messager.messagerreader.dto.*;
import org.messager.messagerreader.entity.Chat;
import org.messager.messagerreader.entity.User;
import org.messager.messagerreader.repo.ChatRepository;
import org.messager.messagerreader.repo.MessageRepository;
import org.messager.messagerreader.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ReaderService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public ChatDto getChat(String id) {
        return ChatDto.fromChat(getChatOrError(id));
    }

    public UserDto getUser(String id) {
        return UserDto.fromUser(getUserOrError(id));
    }

    public GetMessagesResponse getMessages(String chatId, String userId, int count) {
        var chat = getChatOrError(chatId);

        if (!chat.getParticipantIds().contains(userId)) {
            throw new IllegalArgumentException("User with id '" + userId + "' is not a participant of chat with id '" + chatId + "'");
        }
        return GetMessagesResponse.builder()
                .chatId(chatId)
                .messages(
                        messageRepository.getLastMessages(chatId, count).stream()
                                .map(MessageDto::fromMessage)
                                .toList())
                .build();

    }

    private User getUserOrError(String userId) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User with id '" + userId + "' not found"));
    }

    private Chat getChatOrError(String chatId) {
        return chatRepository.findById(chatId).orElseThrow(() -> new IllegalArgumentException("Chat with id '" + chatId + "' not found"));
    }
}
