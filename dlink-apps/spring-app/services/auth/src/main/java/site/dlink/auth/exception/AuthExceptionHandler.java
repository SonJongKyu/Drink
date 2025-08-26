package site.dlink.auth.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.sql.SQLIntegrityConstraintViolationException;

@RestControllerAdvice
public class AuthExceptionHandler {

    /**
     * 사용자 이름이 없을 때 발생하는 UsernameNotFoundException 처리
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<String> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("사용자를 찾을 수 없습니다: " + ex.getMessage());
    }

    /**
     * 중복된 데이터로 인해 발생하는 SQLIntegrityConstraintViolationException 처리
     */
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<String> handleSQLIntegrityConstraintViolationException(SQLIntegrityConstraintViolationException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("데이터베이스 제약 조건 위반: " + ex.getMessage());
    }

    /**
     * DataIntegrityViolationException 처리 (SQL과 연관된 Spring 예외)
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("데이터베이스 무결성 위반");
    }

    /**
     * 기본 Exception 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("서버 내부 오류가 발생했습니다: " + ex.getMessage());
    }
}
