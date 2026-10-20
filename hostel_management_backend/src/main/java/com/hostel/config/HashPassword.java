package com.hostel.config;
import org.mindrot.jbcrypt.BCrypt;
import java.io.Console;

public class HashPassword {
    public static void main(String[] args) {
        Console console = System.console();

        if (console == null) {
            System.out.println(
                "Run this program in a normal terminal, not the VS Code debug console."
            );
            return;
        }

        char[] chars = console.readPassword("Enter a new admin password: ");
        String password = new String(chars);

        if (password.length() < 12) {
            System.out.println("Use at least 12 characters.");
            return;
        }

        String hash = BCrypt.hashpw(password, BCrypt.gensalt(12));
        System.out.println("Generated BCrypt hash:");
        System.out.println(hash);
    }
}
