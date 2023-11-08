//
//  LoginView.swift
//  SUPotify Mobile
//
//  Created by Deniz Özdemir on 10/28/23.
//

import SwiftUI

class LoginViewModel: ObservableObject {
    @Published var isLoggedIn = false
}

struct LoginView: View {
    
    @State private var email = ""
    @State private var password = ""
    @State var isRotated: Bool = false
    @State var showingAlert: Bool = false
    @State private var isEmailEmpty = false
    @State private var isPasswordEmpty = false
    @State private var isLoggedin = false

    var body: some View {
        
        NavigationView{
            ZStack(alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/, content: {
                BackgroundView3()
                
                VStack{
                    Circle()
                        .strokeBorder(AngularGradient(gradient: Gradient(
                            colors: [.indigo, .blue, .purple, .orange, .red]),
                                                      center: .center,
                                                      angle: .zero),
                                      lineWidth: 15)
                        .rotationEffect(isRotated ? .zero : .degrees(360))
                        .frame(maxWidth: 70, maxHeight: 70)
                        .onAppear {
                            withAnimation(Animation.spring(duration: 3)) {
                                isRotated.toggle() //toggle the value
                            }
                            withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
                                isRotated.toggle()
                            }
                        }
                    
                    
                    Text("Welcome Back!")
                        .font(.largeTitle)
                        .bold()
                        .padding(30)
                        .foregroundColor(.black)
                    
                    TextField("Email", text: $email)
                        .padding()
                        .frame(width: 300, height: 50)
                        .background(Color.black.opacity(0.50))
                        .cornerRadius(10)
                        .autocapitalization(.none)
                        .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(isEmailEmpty ? Color.red : Color.black, lineWidth: 2)
                            )
                    
                    SecureField("Password", text: $password)
                        .padding()
                        .frame(width: 300, height: 50)
                        .background(Color.black.opacity(0.50))
                        .cornerRadius(10)
                        .autocapitalization(.none)
                        .keyboardType(.default)
                        .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(isPasswordEmpty ? Color.red : Color.black, lineWidth: 2)
                            )
                    NavigationLink(destination: MainMenu(), isActive: $isLoggedin) { EmptyView() }
                   
                    NavigationStack{
                        Button(action: {
                            if email.isEmpty {
                                isEmailEmpty = true
                            } else {
                                isEmailEmpty = false
                            }
                            
                            if password.isEmpty {
                                isPasswordEmpty = true
                            } else {
                                isPasswordEmpty = false
                            }
                            
                            let parameters: [String: Any] = ["email": email, "password": password]
                            
                            guard let url = URL(string: "http://localhost:4000/auth/login") else {
                                print("Invalid URL")
                                return
                            }
                            
                            var request = URLRequest(url: url)
                            request.httpMethod = "POST"
                            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                            
                            
                            do {
                                request.httpBody = try JSONSerialization.data(withJSONObject: parameters)
                            } catch {
                                print("Error encoding parameters: \(error)")
                                return
                            }
                            
                            URLSession.shared.dataTask(with: request) { data, response, error in
                                if let data = data {
                                    do {
                                        // print("Response JSON: \(String(data: data, encoding: .utf8) ?? "No data")") for debug purposes
                                        
                                        let result = try JSONDecoder().decode(LoginResponse.self, from: data)
                                        
                                        
                                        if let success = result.success, success {
                                            if let userDetails = result.userDetails {
                                                self.isLoggedin = true
                                                print("Login successful")
                                                print("User email: \(userDetails.email)")
                                                print("User username: \(userDetails.username)")
                                            }
                                            else {
                                                print("Login successful but user details are missing")
                                            }
                                        } else {
                                            print(result.message)
                                            if(result.message == "All fields are required")
                                            {
                                                showingAlert = false
                                            }
                                            
                                            else if (result.message == "Incorrect password or email"){
                                                showingAlert = true
                                            }
                                        }
                                    } catch {
                                        print("Error decoding JSON: \(error)")
                                    }
                                } else if let error = error {
                                    print("Error making network request: \(error)")
                                }
                            }.resume()
                            
                        }, label: {
                            Text("Sign in")
                        })}
                        .foregroundColor(.white)
                        .frame(width: 300, height: 50)
                        .background(.black.opacity(0.40))
                        .cornerRadius(10)
                        .border(Color.indigo).cornerRadius(10).padding()
                        .alert(isPresented: $showingAlert) {
                            Alert(
                                title: Text("Login Failed"),
                                message: Text("Incorrect email or password. Please try again."),
                                dismissButton: .default(Text("OK"))
                            )
                        }

                    Text("Don't have an account?")
                        .font(.caption)
                        .opacity(0.70)
                        .foregroundColor(.white)
                    
                        Button(action: {
                            print("Sign up button clicked")
                            
                        }, label: {
                            NavigationLink (destination: SignUpView())
                            {
                                Text("Sign up")
                            }
                        })
                    .padding()
                    .foregroundColor(.white)
                    .frame(width: 100.0, height: 50)
                    .background(.black.opacity(0.40))
                    .border(Color.indigo).cornerRadius(10).padding()
                    .cornerRadius(10)
                }
            }
            )
            }
        .navigationBarBackButtonHidden(true)
        }
}
                           

#Preview {
    LoginView()
        .preferredColorScheme(.dark)
}

struct User: Codable {
    let email: String
    let password: String
    let username: String
    let createdAt: String
    let _id: String
}


struct LoginResponse: Codable {
    let message: String
    let success: Bool?
    let userDetails: User?
}

struct BackgroundView3: View {
    var body: some View {
        LinearGradient(colors: [.blue, .indigo, .blue, .indigo, .blue], startPoint: .topLeading, endPoint: .bottomTrailing)
            .opacity(0.6)
            .ignoresSafeArea()
    
    }
}
