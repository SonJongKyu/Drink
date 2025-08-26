package site.dlink.highball.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.dlink.highball.document.Highball;
import site.dlink.highball.enums.HighballCateEnum;
import site.dlink.highball.repository.HighballRepository;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HighballService {

    private final HighballRepository highballRepository;

    @Transactional
    public void saveHighball(Highball highball, String writeUserId) {
        Instant now = Instant.now();

        highball.setCreatedAt(now);
        highball.setUpdatedAt(now);
        highball.setWriteUser(writeUserId);

        highballRepository.save(highball);
    }

    @Transactional(readOnly = true)
    public Optional<Highball> findById(String id) {
        return highballRepository.findById(id);
    }

    @Transactional
    public void deleteHighball(String id) {
        highballRepository.deleteById(id);
    }

    public List<Highball> findByCategory(HighballCateEnum category) {
        return highballRepository.findByCategory(category.name());
    }

    public Highball findHighballById(String id) {
        return highballRepository.findById(id).orElse(null);
    }

    @Transactional
    public long toggleLike(String highballId, String userId) {
        Highball highball = highballRepository.findById(highballId)
                .orElseThrow(() -> new IllegalArgumentException("Highball not found with id: " + highballId));

        if(highball.getLikedUsers() == null) {
            highball.setLikedUsers(new HashSet<>());
        }

        if (highball.getLikedUsers().contains(userId)) {
            highball.getLikedUsers().remove(userId);
        } else {
            highball.getLikedUsers().add(userId);
        }

        highballRepository.save(highball);
        return highball.getLikedUsers().size();
    }

    @Transactional
    public void updateHighball(Highball highball, String userId) {
        highball.setUpdatedAt(Instant.now());
        highballRepository.save(highball);
    }

    public int countLikedUsers(String highballId) {
        Optional<Highball> highballOpt = highballRepository.findById(highballId);
        return highballOpt.map(h -> h.getLikedUsers().size())
                .orElse(0);
    }

}
