//
//  LikedSongsPage.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 8.11.2023.
//

import SwiftUI
import Foundation
import Combine

struct LikedSongsData: Codable {
    let _id: String
    let username: String
    let likedSongsList: [String]
    let __v: Int
}

struct LikedSongsResponse: Codable {
    let message: String
    let success: Bool
    let likedSongs: LikedSongsData
}

struct LikedSong: Codable {
    let id: Int
}

class LikedSongsViewModel: ObservableObject {
    @Published var likedSongIDs = [String]()
    private var token: String
    private var cancellables = Set<AnyCancellable>()
    @Published var likedSongsCount: Int = 0

    init() {
        self.token = SessionManager.shared.token
        fetchLikedSongs()
    }

    func fetchLikedSongs() {

        guard let url = URL(string: "http://localhost:4000/api/likedSongs/getLikedSongsForUser") else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTaskPublisher(for: request)
            .tryMap { $0.data }
            .decode(type: LikedSongsResponse.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                // Handle completion, errors, etc.
            }, receiveValue: { [weak self] response in
                self?.likedSongIDs = response.likedSongs.likedSongsList
                self?.likedSongsCount = response.likedSongs.likedSongsList.count
            })
            .store(in: &cancellables)
    }
}

struct LikedSongsView: View {
    @State private var showExportOptions = false
    @ObservedObject var viewModel: LikedSongsViewModel

    init() {
        viewModel = LikedSongsViewModel()
        //viewModel.fetchLikedSongs()
    }

    var body: some View {
        NavigationView {
            List(viewModel.likedSongIDs, id: \.self) { songID in
                Text("Song ID: \(songID)")
            }
            .navigationBarTitle("Liked Songs", displayMode: .inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        self.showExportOptions = true
                    }) {
                        Image(systemName: "square.and.arrow.up") // Share icon
                    }
                }
            }
            .sheet(isPresented: $showExportOptions) {
                ExportOptionsView()
            }
        }
    }
}


struct LikedSongsView_Previews: PreviewProvider {
    static var previews: some View {
        LikedSongsView()
    }
}
