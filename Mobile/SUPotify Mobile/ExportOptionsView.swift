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
    var likedSongsList: [String]
    var __v: Int
}


struct ExportOptionsView: View {
    @Environment(\.presentationMode) var presentationMode
    @State private var showShareSheet = false
    @State private var fileURL: URL?
    @State private var userToken: String?
    
    init() {
        self._userToken = State(initialValue: SessionManager.shared.token)
    }

    var body: some View {
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
            Button("Close") {
                            presentationMode.wrappedValue.dismiss()
                        }
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
        }
        .sheet(isPresented: $showShareSheet, onDismiss: {
            self.fileURL = nil
        }) {
            if let url = fileURL {
                ShareSheet(activityItems: [url])
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
                    fileContent = songs.joined(separator: ",")
                case .txt:
                    fileContent = songs.joined(separator: "\n")
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
