package site.dlink.common.constants;

import java.util.Arrays;

public class AlcoholConstants {

    public static final String[] YANGJU_INDICES = {
            "brandy", "gin", "liqueur", "rum", "tequila", "vodka", "whiskey"
    };

    public static final String WINE = "wine";

    public static final String[] ALCOHOL_INDICES;

    static {
        ALCOHOL_INDICES = Arrays.copyOf(YANGJU_INDICES, YANGJU_INDICES.length + 1);
        ALCOHOL_INDICES[YANGJU_INDICES.length] = WINE;
    }
}
