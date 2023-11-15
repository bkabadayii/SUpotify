//
//  ImportView.swift
//  SUPotify Mobile App
//
//  Created by Deniz Özdemir on 11/10/23.
//

import SwiftUI

var isAdded: Bool = false

struct ImportView: View {
    @State var importing = false
    @State var isError = false
    @State var isRotated = false
    @State private var arrowOffset: CGFloat = 0
    //@State private var token: String?

    //init(token: String?){
    //    self.token = SessionManager.shared.loginResponse?.token
    //}
    
    var body: some View {
    
        
        ZStack(alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/) {
            BackgroundView()
            VStack{
                Spacer()
                Text(" ")
                HStack{
                    Text("SUPotify")
                        .font(.title)
                        .fontWeight(.semibold)
                        .foregroundColor(Color.white)
                    Circle()
                        .strokeBorder(AngularGradient(gradient: Gradient(
                            colors: [.indigo, .blue, .purple, .orange, .red]),
                                                      center: .center,
                                                      angle: .zero),
                                      lineWidth: 15)
                        .rotationEffect(isRotated ? .zero : .degrees( 360))
                        .frame(maxWidth: 70, maxHeight: 70)
                        .onAppear {
                            withAnimation(Animation.spring(duration: 3)) {
                                isRotated.toggle() //toggle the value
                            }
                            withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
                                isRotated.toggle()
                            }
                        }
                        .padding()
                }
                HStack{
                    Image(systemName: "square.and.arrow.down")
                    Button("Import Your Liked Songs") {
                    importing = true
                }
                }
             .padding()
             .font(.headline)
             .foregroundColor(.white.opacity(0.90))
             .frame(width: 300, height: 50)
             .background(Color.black.opacity(0.50))
             .cornerRadius(10)
             .alert(isPresented: $isError, content: {
                 Alert(
                     title: Text("Importing Failed"),
                     message: Text("Something went wrong while uploading the file. Please check the file type and try again"),
                     dismissButton: .default(Text("OK"))
                 )
             })
             .fileImporter(
             isPresented: $importing,
             allowedContentTypes: [.plainText]
             ) { result in
             switch result {
             case .success(let file):
                 print(file.absoluteString)
                 handleImportedFile(fileURL: file)
             case .failure(let error):
                 print(error.localizedDescription)
                 isError = true
            }
             }
                Text(" ")
                Text("Please provide a .csv or .txt file that includes the song ids")
                    .font(.caption)
                    .opacity(0.6)
                    
                if isAdded {
                        Image(systemName: "checkmark.circle.fill")
                              .font(.system(size: 80))
                              .foregroundColor(.green)
                              .onAppear {
                                  DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                                      isAdded = false
                                  }
                              }
                      }
            Text(" ")
            Text(" ")
            Image(systemName: "arrowshape.up.fill")
                    .font(.largeTitle)
                    .padding(20)
                    .offset(y: arrowOffset)
                    .onAppear {
                        withAnimation(Animation.linear(duration: 1.5).repeatForever(autoreverses: false)) {
                            arrowOffset = -20
                        }
                    }
             Spacer()
             }
        }
        }
    }

#Preview {
    ImportView()
        .preferredColorScheme(.dark)
}

func read(from url: URL) throws -> String {
    let accessing = url.startAccessingSecurityScopedResource()
    defer {
        if accessing {
            url.stopAccessingSecurityScopedResource()
        }
    }

    return try String(contentsOf: url)
}

private func handleImportedFile(fileURL: URL) {
    do {
        let content = try read(from: fileURL)
        let songIDs = content
                .components(separatedBy: "\n")
                .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) } // Trim whitespace and newlines
                .filter { !$0.isEmpty } // Filter out any empty strings
        addSongsToLikedSongs(songIDs: songIDs)
    }
    catch {
        print(error.localizedDescription)
    }
}

private func addSongsToLikedSongs(songIDs: [String]) {
    let apiURL = URL(string: "http://localhost:4000/api/likedSongs/addManyToUserLikedSongs")!
    var request = URLRequest(url: apiURL)
    
    //var token: String?
    let token = SessionManager.shared.token
    
    
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue( "Bearer \(token)", forHTTPHeaderField: "Authorization")

    let parameters: [String: Any] = ["songIDList": songIDs]
    
    do {
        request.httpBody = try JSONSerialization.data(withJSONObject: parameters)
        print("the songs are added to user liked songs")
        isAdded = true
        
    } catch {
        print("Error encoding parameters: \(error)")
        return
    }

    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            print("Error making network request: \(error)")
        } else {
            // Handle the response if needed
            if let data = data {
                // Process the data, update UI, etc.
                isAdded = true
                print("Received data: \(String(data: data, encoding: .utf8) ?? "")")
            } else {
                print("No data received.")
            }
        }
    }.resume()
}

