package site.dlink.pairing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WinePairingRequest {
    private String korName;
    private String engName;
    private String sweetness;
    private String acidity;
    private String body;
    private String tanin;
    private String foodPairing;
    private String details;
    private String category;
}