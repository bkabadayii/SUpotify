//
//  LoginView.swift
//  SUPotify Mobile
//
//  Created by Deniz Özdemir on 10/28/23.
//

import SwiftUI

struct LoginView: View {
    @State private var username = ""
    @State private var password = ""
    @State private var wrongUsername = 0
    @State private var wrongPassword = 0
    @State private var showingLoginScreen = false


    var body: some View {
        NavigationStack{
            VStack{
                   
                ZStack{
                    
                    LinearGradient(colors: [.blue, .indigo, .blue, .indigo, .blue], startPoint: .topLeading, endPoint: .bottomTrailing)
                        .opacity(0.4)
                        .ignoresSafeArea()
                    Circle()
                        .scale(1.7)
                        .foregroundColor(.white.opacity(0.15))
                    Circle()
                        .scale(1.35)
                        .foregroundColor(.white.opacity(0.70))
                    
                    VStack{
                        
                        Text("Welcome Back!")
                            .font(.largeTitle)
                            .bold()
                            .padding(30)
                            .foregroundColor(.indigo.opacity(0.80))
                        
                        TextField("Username", text: $username)
                            .padding()
                            .frame(width: 300, height: 50)
                            .background(Color.black.opacity(0.50))
                            .cornerRadius(10)
                            .border(.red, width: CGFloat(wrongUsername))
                        
                        SecureField("Password", text: $password)
                            .padding()
                            .frame(width: 300, height: 50)
                            .background(Color.black.opacity(0.50))
                            .cornerRadius(10)
                            .border(.red.opacity(0.30), width: CGFloat(wrongPassword))
                        
                        Button(action: {
                            print("Button clicked")
                        }, label: {
                            NavigationLink(destination: MainMenu()) {
                                Text("Sign in")
                            }
                        })
                        .foregroundColor(.white)
                        .frame(width: 300, height: 50)
                        .background(LinearGradient(colors: [.indigo, .indigo, .indigo, .indigo, .indigo], startPoint: .topLeading, endPoint: .bottomTrailing)
                            .opacity(0.50))
                        .cornerRadius(10)
                        
                        Text("Don't have an account?")
                            .font(.caption)
                            .opacity(0.70)
                            .foregroundColor(.black)
                        NavigationStack{
                            Button(action: {
                                print("Sign up button clicked")
                            }, label: {
                                NavigationLink (destination: SignUpView())
                                {
                                    Text("Sign up")
                                }
                            })
                        }
                        .padding()
                        .foregroundColor(.white)
                        .frame(width: 100.0, height: 50)
                        .background(.black.opacity(0.50))
                        .border(Color.indigo)
                        .cornerRadius(10)
                    }
                    
                }
            }
                .navigationBarHidden(true)
            }
        }
        }
    
    
    /*func authenticateUser(username: String, password: String) {
            if username.lowercased() == "cs308" {
                wrongUsername = 0
                if password.lowercased() == "123" {
                    wrongPassword = 0
                    showingLoginScreen = true
                } else {
                    wrongPassword = 2
                }
            } else {
                wrongUsername = 2
            }
        }*/
                           

#Preview {
    LoginView()
        .preferredColorScheme(.dark)

}
