package site.dlink.auth.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.dlink.auth.dto.GetUserDto;
import site.dlink.auth.entity.User;
import site.dlink.auth.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public GetUserDto getUserDtoById(String id) {
        User user = getUserById(id);
        return GetUserDto.builder()
                .email(user.getEmail())
                .name(user.getName())
                .profileImageUri(user.getProfileImageUri())
                .build();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
