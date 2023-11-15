//
//  SessionManager.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 14.11.2023.
//

import Foundation

class SessionManager {
    
    static let shared = SessionManager()
    var loginResponse: LoginResponse?
    var token: String

    private init() {
        self.token = ""
    } // Private initialization to ensure just one instance is created.
}
