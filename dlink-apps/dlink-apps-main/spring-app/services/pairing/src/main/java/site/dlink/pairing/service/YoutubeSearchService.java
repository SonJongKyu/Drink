package site.dlink.pairing.service;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class YoutubeSearchService {

    public String getShortsLink(String dish) {
        // Docker 컨테이너에 설치된 Chromium 및 Chromedriver 사용
        System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
        System.setProperty("webdriver.chrome.binary", "/usr/bin/chromium");

        ChromeOptions options = new ChromeOptions();
        options.setBinary("/usr/bin/chromium"); // 명시적 지정
        options.addArguments("--headless"); // 백그라운드 모드
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920x1080");

        // Selenium WebDriver 실행
        WebDriver driver = new ChromeDriver(options);
        try {
            String searchQuery = dish.replace(" ", "+") + "+shorts";
            String searchUrl = "https://www.youtube.com/results?search_query=" + searchQuery;
            driver.get(searchUrl);

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(1));
            wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a#thumbnail")));

            // 첫 번째 Shorts 링크 찾기
            List<WebElement> thumbnails = driver.findElements(By.cssSelector("a#thumbnail"));
            for (WebElement thumb : thumbnails) {
                String href = thumb.getAttribute("href");
                if (href != null && href.contains("/shorts/")) {
                    return href;
                }
            }
            return "No Shorts link found";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error retrieving Shorts link: " + e.getMessage();
        } finally {
            driver.quit(); // WebDriver 종료
        }
    }
}
