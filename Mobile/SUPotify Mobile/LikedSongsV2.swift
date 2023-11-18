//
//  LikedSongsV2.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 17.11.2023.
//

import SwiftUI
import Foundation
import Combine

struct LikedSong: Codable {
    let _id: String
    let name: String
    let popularity: Int
    let durationMS: Int
    let album: AlbumData
    let artists: [ArtistData]
    let spotifyID: String
    let spotifyURL: String
    let previewURL: String?
    
    
}
struct AlbumData: Codable {
    let _id: String
    let name: String
    let releaseDate: String
    let totalTracks: Int
    let genres: [String]
    let artists: [String]
    let tracks: [String]
    let spotifyID: String
    let spotifyURL: String
    let imageURL: String
    let __v: Int
    
}

struct ArtistData: Codable {
    let _id: String
    let name: String
    let genres: [String]
    let popularity: Int
    let albums: [String]
    let spotifyID: String
    let spotifyURL: String
    let imageURL: String
    
}

struct LikedSongsData: Codable {
    let _id: String
    let username: String
    let likedSongsList: [LikedSong]
    let __v: Int
}

struct LikedSongsResponse: Codable {
    let message: String
    let success: Bool
    let likedSongs: LikedSongsData
}



class LikedSongsViewModel: ObservableObject {
    @Published var likedSongs = [LikedSong]()
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
                switch completion {
                case .finished:
                    print("Retrieved data successfully.")
                case .failure(let error):
                    print("Error occurred: \(error)")
                }
            }, receiveValue: { [weak self] response in
                self?.likedSongs = response.likedSongs.likedSongsList
                self?.likedSongsCount = response.likedSongs.likedSongsList.count
            })
            .store(in: &cancellables)
    }
}

struct LikedSongsV2: View {
    
   // var topSpacer_height:CGFloat = 400
    @State var searchBox_offset:CGFloat = 30
    
    @State private var searchText = ""
    @State private var isSearchEmpty = false
    
    @State private var showExportOptions = false
    @State private var showImportView = false
    @ObservedObject var viewModel: LikedSongsViewModel
    
    init(){
        viewModel = LikedSongsViewModel()
    }
    
    var body: some View {
        ZStack{
            
            // Layer 0
            LinearGradient(gradient: Gradient(colors:
           [Color.blue,
            Color.indigo,Color.blue, Color.indigo, Color.blue, Color.black,Color.black, Color.black, Color.black, Color.black]),
           startPoint: .topLeading, endPoint: .bottomTrailing)
            .opacity(0.6)
            .edgesIgnoringSafeArea(.all)
            
            
            // Layer 1
            ScrollView{
                GeometryReader{geo -> AnyView? in
                    let thisOffset = geo.frame(in: .global).minY
                    DispatchQueue.main.async {
                        if thisOffset > 38 {
                            self.searchBox_offset = thisOffset
                        }
                        else{
                            self.searchBox_offset = 38
                        }
                    }
                    return nil
                }
                VStack (spacing:0) {
                    HStack{
                        Spacer()
                            .frame(height: 80)
                            .background(LinearGradient(gradient:
                                Gradient(colors:
                                [Color.clear,
                                 Color.clear,
                                 //Color.clear,
                                 //Color.clear,
                                 //Color.clear,
                                 Color.clear,
                                 Color.black]),
                               startPoint: .top, endPoint: .bottom))
                    }
                    VStack{
                        
                        ForEach(viewModel.likedSongs, id: \._id){ song in
                            let artists = song.artists.map { $0.name }.joined(separator: ", ")
                            let albumImageURL = song.album.imageURL
                            HStack{
                                LImage_RText(songName: song.name, artistNames: artists, imageURL: albumImageURL)
                                Spacer()
                            }
                        }
                        
                        
                        /*
                        // For preview
                        ForEach(0..<30){ i in
                            HStack{
                                LImage_RText(songName: "track", artistNames: "artists", imageURL: "https://i.scdn.co/image/ab6761610000e5eb59ba2466b22929f5e7ca21e4")
                                Spacer()
                            }
                        }
                        */
                    }.background(Color.black)
                }
            }
            
            
            // Layer 2
            VStack (spacing:0) {
                LinearGradient(colors:
                [Color.blue, Color.clear],
                startPoint: .top, endPoint: .bottom)
                    .opacity(0.4)
                    .ignoresSafeArea()
                    .frame(height:80)
                Spacer()
            }.edgesIgnoringSafeArea(.all)
            
            
            // Layer 3
            VStack {
                Spacer()
                    .frame(height:searchBox_offset + 5)
                
                HStack{
                    
                    TextField("Search", text: $searchText)
                        .autocapitalization(.none)
                        .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(isSearchEmpty ? Color.red : Color.black, lineWidth: 2)
                            )
                }
                .padding()
                .frame(width: 300, height: 40)
                .background(Color.black.opacity(0.90))
                .cornerRadius(25)
                .font(.system(size: 17, weight:.bold))
                .shadow(radius: 20)
                Spacer()
            }
            
            
            // Layer 4
            VStack{
                HStack{
                    Button(action: {
                        self.showImportView = true
                    }) {
                        Image(systemName: "arrow.down.doc")
                            .foregroundColor(.white)
                    }
                    .padding()
                    Spacer()
                    Text("Liked Songs")
                        .font(.system(size: 24, weight:.bold))
                    Spacer()
                    Button(action: {
                        self.showExportOptions = true
                    }) {
                        Image(systemName: "square.and.arrow.up")
                            .foregroundColor(.white)
                    }.padding()
                    
                }
                Spacer()
            }
            /* For UI adjustments
            VStack{
                Text("\(searchBox_offset)")
                    .foregroundColor(.yellow)
                Spacer()
            }
            */
            
            
            .sheet(isPresented: $showExportOptions, onDismiss: {
                //navigationViewKey = UUID()
                showExportOptions = false
            }) {
                ExportOptionsView()
            }
            
            
            .sheet(isPresented: $showImportView, onDismiss: {
                //navigationViewKey = UUID()
                showImportView = false
            }) {
                ImportView()
            }
            
        }
    }
    
    func commaSeparatedString(from array: [String]) -> String {
            array.joined(separator: ", ")
    }
}

#Preview {
    LikedSongsV2()
        .preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
