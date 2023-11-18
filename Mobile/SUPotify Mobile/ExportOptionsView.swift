//
//  ExportOptionsView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 14.11.2023.
//

import SwiftUI
import Foundation


struct LikedSongs: Codable {
    var _id: String
    var username: String
    var likedSongsList: [LikedSong]
    var __v: Int
}


struct ExportOptionsView: View {
    @Environment(\.presentationMode) var presentationMode
    @State var isRotated = false
    @State private var showShareSheet = false
    @State private var fileURL: URL?
    @State private var userToken: String?
    
    init() {
        self._userToken = State(initialValue: SessionManager.shared.token)
    }
    
    var body: some View {
        ZStack{
            // Layer 1
            BackgroundView()
            
            VStack {
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
                    .padding()
                }
                VStack {
                    Button("Export as CSV") {
                        if let token = userToken {
                            exportSongs(format: .csv, token: token) { url in
                                self.fileURL = url
                                self.showShareSheet = true
                            }
                        }
                    }
                    
                    Button("Export as TXT") {
                        if let token = userToken {
                            exportSongs(format: .txt, token: token) { url in
                                self.fileURL = url
                                self.showShareSheet = true
                            }
                        }
                    }
                    Spacer()
                }
                
            }
            
            // Layer 2
            
            .sheet(isPresented: $showShareSheet, onDismiss: {
                self.fileURL = nil
            }) {
                if let url = fileURL {
                    ShareSheet(activityItems: [url])
                }
            }
        }
    }
    
    func exportSongs(format: ExportFormat, token: String, completion: @escaping (URL?) -> Void) {
        let baseUrl = "http://localhost:4000/api/likedsongs/"
        let endpoint = "getLikedSongsForUser"
        guard let url = URL(string: baseUrl + endpoint) else {
            print("Invalid URL")
            completion(nil)
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error fetching data: \(error)")
                completion(nil)
                return
            }
            
            guard let data = data else {
                print("No data returned")
                completion(nil)
                return
            }
            
            do {
                let jsonResponse = try JSONDecoder().decode(LikedSongsResponse.self, from: data)
                let songs = jsonResponse.likedSongs.likedSongsList
                
                let fileContent: String
                switch format {
                case .csv:
                    fileContent = createCSVContent(songs: songs)
                case .txt:
                    fileContent = createTXTContent(songs: songs)
                }
                
                let fileName = "exported_songs.\(format.rawValue)"
                let path = FileManager.default.temporaryDirectory.appendingPathComponent(fileName)
                
                try fileContent.write(to: path, atomically: true, encoding: .utf8)
                DispatchQueue.main.async {
                    completion(path)
                }
            } catch {
                print("Error parsing data: \(error)")
                completion(nil)
            }
        }.resume()
    }
    func createCSVContent(songs: [LikedSong]) -> String {
        let header = "ID,Name,Popularity,Duration\n"
        let rows = songs.map { "\($0._id),\($0.name),\($0.popularity),\($0.durationMS)" }
        return header + rows.joined(separator: "\n")
    }
    
    func createTXTContent(songs: [LikedSong]) -> String {
        return songs.map { "\($0.name) [\($0._id)]" }.joined(separator: "\n")
    }
}

enum ExportFormat: String {
    case csv = "csv"
    case txt = "txt"
}

struct ShareSheet: UIViewControllerRepresentable {
    var activityItems: [Any]
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        let controller = UIActivityViewController(activityItems: activityItems, applicationActivities: nil)
        return controller
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}


#Preview {
    ExportOptionsView().preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
