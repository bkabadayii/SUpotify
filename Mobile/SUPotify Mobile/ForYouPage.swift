//  ForYouPage.swift
//  SUPotify Mobile App
//
//  Created by Deniz Özdemir on 11/9/23.
//

import SwiftUI

struct Track: Codable {
    let _id: String
    let name: String
    let popularity: Int
    let durationMS: Int
    let album: Album
    let artists: [Artist]
   let spotifyID: String
    let spotifyURL: URL
    let previewURL: URL?
    let __v: Int?
}

struct Album: Codable {
    let _id: String
    let name: String?
    let spotifyURL: String?
    let imageURL: String
    let artists: [Artist]?
}

struct Artist: Codable {
    let _id: String
    let name: String
    let genres: [String]?
    let popularity: Int?
    let spotifyURL: String?
    let imageURL: String?
}

struct LikedTrack: Codable {
    let track: Track
  //  let likedAt: Date
   // let id: String
}

struct Response: Codable {
    let message: String
    let recommendations: [LikedTrack]
    let success: Bool
}

struct ResponseTrackInfo: Codable {
    let message: String
    let track: Track
    let success: Bool
}

struct LyricsResponse: Codable {
    let lyrics: String
    let success: Bool
}

struct RatingRecommendationResponse: Codable {
    let mostPopularTracks: [PopularTrack]
}

struct PopularTrack: Codable {
    let _id: String
    let name: String
    let popularity: Int
    let durationMS: Int
    let album: String
    let artists: [ArtistPopular]
   let spotifyID: String
    let spotifyURL: URL
    let previewURL: URL?
    let __v: Int?
    var albumURL: String?
    var albumName: String?
    var artistNames: [String]?
}

struct ArtistPopular: Codable {
    let _id: String
    let genres: [String]
}

struct TemporalRecommendationResponse: Codable {
    var randomTrack: TrackSingle
    let artistName: String
}
struct TrackSingle: Codable {
   let _id: String
    let name: String
   // let popularity: Int
   // let durationMS: Int
    let album: String
   // let artists: [String]
    let spotifyID: String
    let spotifyURL: URL
   // let previewURL: URL?
   // let __v: Int
    var albumURL: String?
    var albumName: String?
}

struct TrackResponse: Codable{
    var message: String
    var success: Bool
    var track: Track
}

struct ArtistResponse: Codable {
    let message: String
    let success: Bool
    let artist: ArtistDetail
}

struct ArtistDetail: Codable {
    let name: String
    let genres: [String]
    let albums: [Album]
    let popularity: Int
}

struct ForYouView: View {
    @State private var selectedTab = 0
    @EnvironmentObject var viewModelRec: SharedForRecommendation

    var body: some View {
        ZStack {
            BackgroundView()
            VStack {
                Picker("Options", selection: $selectedTab) {
                    Text("Friend based").tag(0)
                    Text("Rating based").tag(1)
                    Text("Temporal").tag(2)
                }
                .padding(.top, 10)
                .padding(.bottom, 5)
                .padding(.horizontal)
                .pickerStyle(SegmentedPickerStyle())
                

                Group {
                    switch selectedTab {
                    case 0:
                        FriendBased()
                    case 1:
                        RatingBased()
                    default:
                        Temporal()
                    }
                }
                .transition(.opacity)
            }
            
        }
    }
}



#Preview {
    ForYouView()
        .preferredColorScheme(.dark)
        .environmentObject(SharedForRecommendation.shared)
}

class Host: UIHostingController<ContentView> {
    override var preferredStatusBarStyle: UIStatusBarStyle{
        return .lightContent
    }
}

struct TrackCardView: View {
    let track: Track
    let friendUsername: String?
    @State var errorMessage: String = ""
    @State private var showLyricsPopup = false
    @EnvironmentObject var viewModelRec: SharedForRecommendation
    @State private var showSpotifyURL: Bool = false
    @State private var scale: CGFloat = 1

    var body: some View {
        VStack{
            VStack(alignment: .center, spacing: 5) {
                if let url = URL(string: track.album.imageURL ?? "") {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                        case .success(let image):
                            image
                                .resizable()
                                .frame(width: 300, height: 430)
                                .cornerRadius(35)
                            
                        case .failure:
                            Image(systemName: "photo")
                                .frame(width: 300, height: 430)
                                .cornerRadius(10)
                        @unknown default:
                            EmptyView()
                        }
                    }
                }
                
                Text(track.name)
                    .font(.headline)
                    .bold()
                
                ForEach(track.artists, id: \.name) { artist in
                    Text(artist.name ?? "")
                        .font(.subheadline)
                }
                
                Text(track.album.name!)
                    .font(.caption)
                
            }
            .frame(width: 400, height: 530)
            .padding(.bottom, 8)
            .cornerRadius(20)
            
            VStack{
                if let friendUsername = friendUsername {
                    Text("Recommended by \(friendUsername)")
                        .frame(width: 159, height: 40)
                        .background(.indigo.opacity(0.60))
                        .cornerRadius(100)
                        .font(.caption)
                        .foregroundColor(.white)
                        .fixedSize()
                        .padding(.bottom, 2)
                        .italic()
                        .lineLimit(2)
                        .scaleEffect(scale)  // Apply scale effect
                        .onAppear {
                                               // Repeating animation
                                               withAnimation(Animation.easeInOut(duration: 1).repeatForever(autoreverses: true)) {
                                                   scale = 1.1  // Scale up to 120%
                                               }
                                           }
                        
                }
                HStack (spacing: 12){
                    Button(action: {
                        viewModelRec.ShowSongInfo(track: track)
                        self.showLyricsPopup = true
                    }, label: {
                        VStack (spacing: 8){
                            Image(systemName: "music.note.list")
                                .font(.title)
                                .foregroundColor(.indigo)
                            
                        }
                    }).sheet(isPresented: $showLyricsPopup) {
                        LyricsPopupView()
                    }
                    
                    Button(action: {
                        viewModelRec.addToLikedSongs(trackId: track.spotifyID, albumId: track.album._id)
                    }, label: {
                        VStack (spacing: 10)
                        {
                            Image(systemName: "heart.fill")
                                .font(.title)
                                .foregroundColor(.indigo)
                        }
                    }).alert(isPresented: $viewModelRec.isAdded) {
                        Alert(
                            title: Text("Success"),
                            message: Text("Recommended song added to liked songs successfully"),
                            dismissButton: .default(Text("OK"))
                        )
                    }
                    
                    Button(action: {
                        self.showSpotifyURL = true
                        UIPasteboard.general.url = track.spotifyURL
                    }, label: {
                        VStack (spacing: 8){
                            Image(systemName: "square.and.arrow.up.fill")
                                .font(.title)
                                .foregroundColor(.indigo)
                        }
                    })
                }
                .frame(width: 300, height: 60)
                .background(.black.opacity(0.30))
                .cornerRadius(100)
                .padding(.bottom)
            }
        }
        .sheet(isPresented: $showSpotifyURL) {
            SharePopupView(spotifyURL: track.spotifyURL)
            }
        }
}



struct LyricsPopupView: View {
    @EnvironmentObject var viewModelRec: SharedForRecommendation
    var body: some View {
        ZStack {
            Color.black.opacity(0.2)
                .edgesIgnoringSafeArea(.all)

            VStack(spacing: 10) {
                Text("Lyrics")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding(.top, 15)
                
                ScrollView(.vertical, showsIndicators: false) {
                                VStack(alignment: .leading, spacing: 10) {
                                    ForEach(Array(viewModelRec.songLyrics.split(separator: "\n").enumerated()), id: \.offset) { index, line in
                                        Text(line)
                                            .foregroundColor(.white)
                                            .font(.body)
                                            .padding([.horizontal, .bottom], 10)
                                    }
                                }
                                .padding(.top)
                            }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background( LinearGradient(colors: [.blue, .indigo, .blue, .indigo, .blue], startPoint: .topLeading, endPoint: .bottomTrailing)
                    .opacity(0.4)
                    .ignoresSafeArea())
                .cornerRadius(20)
                .padding()
            }
        }
    }
}

struct FriendBased: View {
    @GestureState private var dragOffset: CGFloat = 0
    @State var isRotated = false
    @State var showErrorAlert: Bool = false
    @EnvironmentObject var viewModelRec: SharedForRecommendation
    @State private var animateCircle = false


    var body: some View {
        VStack {
            if viewModelRec.isLoading {
                Spacer()
                HStack{
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
                                isRotated.toggle()
                            }
                            withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
                                isRotated.toggle()
                            }
                        }
                        .padding()
                    Text("We are bringing your recommendations for you based on your friends tastes!")
                        .font(.headline)
                        .padding()
                        .foregroundColor(.white)
                }.frame(width: 400, height: 530)
                Spacer()
            }
            else {
                ZStack {
                        ForEach(viewModelRec.recommendedTracks.indices, id: \.self) { index in
                                        Group {
                                            if index == viewModelRec.currentIdx {
                                                TrackCardView(track: viewModelRec.recommendedTracks[index], friendUsername: viewModelRec.friendName)
                                                    .offset(x: dragOffset)
                                                    .transition(.slide)
                                                    .animation(.easeInOut, value: dragOffset)
                                            }
                                        }
                                    }
                                }
                                .gesture(
                                  DragGesture()
                                      .updating($dragOffset, body: { value, state, _ in
                                          state = value.translation.width
                                      })
                                      .onEnded({ value in
                                          let threshold: CGFloat = 50
                                          if value.translation.width > threshold {
                                              viewModelRec.currentIdx = max(0, viewModelRec.currentIdx - 1)
                                          } else if value.translation.width < -threshold {
                                              viewModelRec.currentIdx = min(viewModelRec.recommendedTracks.count - 1, viewModelRec.currentIdx + 1)
                                          }
                                      })
                                )
                            }
                        }
        .onAppear {
            viewModelRec.fetchRecommendations()
        }
        
    }
}

struct AlbumResponse: Codable {
    let message: String
    let success: Bool
    let album: Album
}


class SharedForRecommendation: ObservableObject {
    static let shared = SharedForRecommendation()
    @Published var recommendedTracks: [Track] = []
      @Published  var isLoading = true
    @Published  var isLoading2 = true
    @Published  var isLoading3 = true
      @Published  var currentIdx: Int = 0
    @Published  var currentIdx2: Int = 0
    @Published var isRotated = false
    @Published var isAdded: Bool = false
    @Published  var songLyrics: String = ""
    @Published var showErrorAlert: Bool = false
       @Published var errorMessage: String = ""
    @Published var recommendedTracksRating: [PopularTrack] = []
    @Published var temporalRecommendation: TemporalRecommendationResponse?
    @Published var albumUrl: String = ""
    @Published var friendName: String = ""
    
    func fetchTrack(trackID: String, completion: @escaping (Track?) -> Void) {
        let token = SessionManager.shared.token
        let urlString = "http://localhost:4000/api/content/getTrack/\(trackID)"
        guard let url = URL(string: urlString) else {
            print("Invalid URL")
            completion(nil)
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error: \(error.localizedDescription)")
                completion(nil)
                return
            }
            
            guard let data = data else {
                print("No data received")
                completion(nil)
                return
            }

            do {
                let trackResponse = try JSONDecoder().decode(TrackResponse.self, from: data)
                DispatchQueue.main.async {
                    if trackResponse.success {
                        completion(trackResponse.track)
                    } else {
                        print("Failed to fetch track: \(trackResponse.message)")
                        completion(nil)
                    }
                }
            } catch {
                print("Decoding Error: \(error.localizedDescription)")
                completion(nil)
            }
        }.resume()
    }

    func fetchArtistDetails(artistID: String, completion: @escaping (String) -> Void) {
            let token = SessionManager.shared.token
            let urlString = "http://localhost:4000/api/content/getArtist/\(artistID)"
            guard let url = URL(string: urlString) else {
                print("Invalid URL")
                completion("")
                return
            }

            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

            URLSession.shared.dataTask(with: request) { data, response, error in
                if let error = error {
                    print("Error: \(error.localizedDescription)")
                    completion("")
                    return
                }
                
                guard let data = data else {
                    print("No data received")
                    completion("")
                    return
                }

                do {
                    let artistResponse = try JSONDecoder().decode(ArtistResponse.self, from: data)
                    DispatchQueue.main.async {
                        if artistResponse.success {
                            completion(artistResponse.artist.name)
                        } else {
                            print("Failed to fetch artist: \(artistResponse.message)")
                            completion("")
                        }
                    }
                } catch {
                    print("Decoding Error: \(error.localizedDescription)")
                    completion("")
                }
            }.resume()
        }


    func fetchAlbumDetails(albumID: String, completion: @escaping ((albumUrl: String, albumName: String?)) -> Void) {
            let token = SessionManager.shared.token
            let urlString = "http://localhost:4000/api/content/getAlbum/\(albumID)"
            guard let url = URL(string: urlString) else {
                print("Invalid URL")
                completion(("", ""))
                return
            }

            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

            URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
                if let error = error {
                    print("Error: \(error.localizedDescription)")
                    completion(("", ""))
                    return
                }
                
                guard let data = data else {
                    print("No data received")
                    completion(("", ""))
                    return
                }

                do {
                            let response = try JSONDecoder().decode(AlbumResponse.self, from: data)
                            DispatchQueue.main.async {
                                completion((response.album.imageURL, response.album.name))
                            }
                        } catch {
                            print("Decoding Error: \(error.localizedDescription)")
                            completion(("", ""))
                        }
            }.resume()
        }


    func addToLikedSongs(trackId: String, albumId: String) {
        let token = SessionManager.shared.token
        let urlString = "http://localhost:4000/api/likedContent/likeTrackBySpotifyID"
        guard let url = URL(string: urlString) else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let body: [String: Any] = [
            "spotifyID": trackId,
            "albumSpotifyID": albumId
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            print("Error creating request body: \(error)")
            return
        }
        
        URLSession.shared.dataTask(with: request) {data, response, error in
            if let httpResponse = response as? HTTPURLResponse {
                print("HTTP Response Status: \(httpResponse.statusCode)")
            }
            
            if let error = error {
                print("Error adding track to liked songs: \(error.localizedDescription)")
                return
            }
            
            guard let data = data else {
                print("No data received")
                return
            }
            
            if let responseString = String(data: data, encoding: .utf8) {
                print("Raw Response Data: \(responseString)")
            }
            
            do {
                           if let responseData = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                               DispatchQueue.main.async {
                                   if let success = responseData["success"] as? Bool {
                                       if success {
                                           self.isAdded = true
                                       } else if let message = responseData["message"] as? String {
                                           // If the song already exists in liked songs
                                           self.errorMessage = message
                                           self.showErrorAlert = true
                                       }
                                   } else {
                                       print("Unexpected response format")
                                   }
                               }
                           } else {
                               print("Response data is not a dictionary")
                           }
                       } catch {
                           print("Error decoding response data: \(error)")
                       }
                   }.resume()
    }
    
    func ShowSongInfo(track: Track) {
        self.songLyrics = ""
        guard let artistName = track.artists.first?.name else { return }
        let songName = track.name
        
        let token = SessionManager.shared.token
        let encodedSongName = songName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedArtistName = artistName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""

        let urlString = "http://localhost:4000/api/getFromGenius/getLyricsOfASong/\(encodedSongName)/\(encodedArtistName)"
        guard let url = URL(string: urlString) else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let data = data {
                do {
                    let jsonResponse = try JSONDecoder().decode(LyricsResponse.self, from: data)
                    DispatchQueue.main.async {
                        self.songLyrics = jsonResponse.lyrics
                    }
                } catch {
                    print("Error decoding lyrics: \(error)")
                }
            } else if let error = error {
                print("Network error: \(error)")
            }
        }.resume()
    }
    
    func ShowSongInfo2(track: PopularTrack) {
        self.songLyrics = ""
        guard let artistName = track.artistNames?.first else { return }
        let songName = track.name
        
        let token = SessionManager.shared.token
        let encodedSongName = songName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedArtistName = artistName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""

        let urlString = "http://localhost:4000/api/getFromGenius/getLyricsOfASong/\(encodedSongName)/\(encodedArtistName)"
        guard let url = URL(string: urlString) else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let data = data {
                do {
                    let jsonResponse = try JSONDecoder().decode(LyricsResponse.self, from: data)
                    DispatchQueue.main.async {
                        self.songLyrics = jsonResponse.lyrics
                    }
                } catch {
                    print("Error decoding lyrics: \(error)")
                }
            } else if let error = error {
                print("Network error: \(error)")
            }
        }.resume()
    }
    
    func ShowSongInfo3(recommendation: TemporalRecommendationResponse) {
        self.songLyrics = ""
        let songName = recommendation.randomTrack.name
        let artistName = recommendation.artistName
        
        let token = SessionManager.shared.token
        let encodedSongName = songName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedArtistName = artistName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""

        let urlString = "http://localhost:4000/api/getFromGenius/getLyricsOfASong/\(encodedSongName)/\(encodedArtistName)"
        guard let url = URL(string: urlString) else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let data = data {
                do {
                    let jsonResponse = try JSONDecoder().decode(LyricsResponse.self, from: data)
                    DispatchQueue.main.async {
                        self.songLyrics = jsonResponse.lyrics
                    }
                } catch {
                    print("Error decoding lyrics: \(error)")
                }
            } else if let error = error {
                print("Network error: \(error)")
            }
        }.resume()
    }
    
    func fetchRecommendationsRating() {
            let token = SessionManager.shared.token
            let url = URL(string: "http://localhost:4000/api/recommendation/recommendTrackFromUserRatings")!

            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

            URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
                DispatchQueue.main.async {
                    if let error = error {
                        print("Error: \(error.localizedDescription)")
                        return
                    }

                    guard let data = data else {
                        print("No data received")
                        return
                    }

                    do {
                        let response = try JSONDecoder().decode(RatingRecommendationResponse.self, from: data)
                        self?.processTracks(response.mostPopularTracks)
                    } catch {
                        print("Decoding Error: \(error.localizedDescription)")
                    }
                }
            }.resume()
        }

    private func processTracks(_ tracks: [PopularTrack]) {
        var processedTracks: [PopularTrack] = []
        let group = DispatchGroup()

        for track in tracks {
            group.enter()
            fetchAlbumAndArtistDetails(track: track) { updatedTrack in
                processedTracks.append(updatedTrack)
                group.leave()
            }
        }

        group.notify(queue: .main) {
            self.recommendedTracksRating = processedTracks
            self.isLoading2 = false
        }
    }

    private func fetchAlbumAndArtistDetails(track: PopularTrack, completion: @escaping (PopularTrack) -> Void) {
        var updatedTrack = track

        fetchAlbumDetails(albumID: track.album) { albumURL, albumName in
            updatedTrack.albumURL = albumURL
            updatedTrack.albumName = albumName

            let artistGroup = DispatchGroup()
            var artistNames: [String] = []
            for artist in track.artists {
                artistGroup.enter()
                self.fetchArtistDetails(artistID: artist._id) { artistName in
                    artistNames.append(artistName)
                    artistGroup.leave()
                }
            }

            artistGroup.notify(queue: .main) {
                updatedTrack.artistNames = artistNames
                completion(updatedTrack)
            }
        }
    }
    
    func fetchRecommendations() {
        let trackNum = 10
        let token = SessionManager.shared.token
        let url = URL(string: "http://localhost:4000/api/recommendation/recommendTrackFromFollowedUser/\(trackNum)")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
                DispatchQueue.main.async {
                    if let httpResponse = response as? HTTPURLResponse {
                        print("HTTP Response Status Code: \(httpResponse.statusCode)")
                    }

                    if let error = error {
                        print("Network Request Error: \(error.localizedDescription)")
                        return
                    }
                    
                    guard let data = data, !data.isEmpty else {
                        print("No data received or data is empty")
                        return
                    }
                    
                    // Print raw data for inspection
                    if let responseString = String(data: data, encoding: .utf8) {
                        print("Raw Response Data: \(responseString)")
                    }

                    do {
                        let response = try JSONDecoder().decode(Response.self, from: data)
                        self.recommendedTracks = response.recommendations.map { $0.track }
                        self.isLoading = false
                        self.extractFriendNameFromMessage(response.message)
                    } catch {
                        print("Decoding Error: \(error.localizedDescription)")
                    }
                }
            }.resume()
    }
    
    private func extractFriendNameFromMessage(_ message: String) {
           // Assuming the friend's name is at the end after the last space
            self.friendName = " "
           if let lastSpaceIndex = message.lastIndex(of: " ") {
               let friendNameIndex = message.index(after: lastSpaceIndex)
               self.friendName = String(message[friendNameIndex...])
           }
       }
    
    
    func fetchTemporalRecommendation() {
        let token = SessionManager.shared.token
        let urlString = "http://localhost:4000/api/recommendation/recommendTrackFromTemporal"
        guard let url = URL(string: urlString) else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            guard let self = self else { return }

            DispatchQueue.main.async {
                if let error = error {
                    print("Error: \(error.localizedDescription)")
                    return
                }
                
                guard let data = data else {
                    print("No data received")
                    return
                }

                do {
                    var response = try JSONDecoder().decode(TemporalRecommendationResponse.self, from: data)
                    let albumID = response.randomTrack.album
                    self.fetchAlbumDetails(albumID: albumID) { albumURL, albumName in
                        response.randomTrack.albumURL = albumURL
                        response.randomTrack.albumName = albumName
                    DispatchQueue.main.async {
                        self.temporalRecommendation = response
                        self.isLoading3 = false
                    }
                    }
                        }
                catch {
                    print ("Decoding Error: \(error.localizedDescription)")
                        }
                }
        }.resume()
    }
    
}

struct TrackCardViewForRating: View {
    let track: PopularTrack
    @State var errorMessage: String = ""
    @State private var showLyricsPopup = false
    @EnvironmentObject var viewModelRec: SharedForRecommendation
    @State private var showSpotifyURL: Bool = false

    var body: some View {
        VStack{
            VStack(alignment: .center, spacing: 5) {
                if let albumURL = track.albumURL, let url = URL(string: albumURL) {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                        case .success(let image):
                            image
                                .resizable()
                                .frame(width: 300, height: 430)
                                .cornerRadius(35)
                        case .failure:
                            Image(systemName: "photo")
                                .frame(width: 300, height: 430)
                                .cornerRadius(10)
                        @unknown default:
                            EmptyView()
                        }
                    }
                }
                
                Text(track.name)
                    .font(.headline)
                    .bold()
                
                if let artistNames = track.artistNames {
                    ForEach(artistNames, id: \.self) { artistName in
                        Text(artistName).font(.subheadline)
                    }
                }
                
                Text(track.albumName ?? "")
                    .font(.caption)
                
            }
            .frame(width: 350, height: 530)
            .padding()
            .cornerRadius(20)
            
            HStack (spacing: 12){
                Button(action: {
                    viewModelRec.ShowSongInfo2(track: track)
                    self.showLyricsPopup = true
                }, label: {
                    VStack (spacing: 8){
                        Image(systemName: "music.note.list")
                            .font(.title)
                            .foregroundColor(.indigo)
                        
                    }
                }).sheet(isPresented: $showLyricsPopup) {
                    LyricsPopupView()
                }
                
                Button(action: {
                    viewModelRec.addToLikedSongs(trackId: track.spotifyID, albumId: track.album)
                }, label: {
                    VStack (spacing: 10){
                        Image(systemName: "heart.fill")
                            .font(.title)
                            .foregroundColor(.indigo)
                    }
                }).alert(isPresented: $viewModelRec.isAdded) {
                    Alert(
                        title: Text("Success"),
                        message: Text("Recommended song added to liked songs successfully"),
                        dismissButton: .default(Text("OK"))
                    )
                }

                Button(action: {
                    self.showSpotifyURL = true
                    UIPasteboard.general.url = track.spotifyURL
                }, label: {
                    VStack (spacing: 8){
                        Image(systemName: "square.and.arrow.up.fill")
                            .font(.title)
                            .foregroundColor(.indigo)
                    }
                })
            }
            .frame(width: 300, height: 60)
            .background(.black.opacity(0.30))
            .cornerRadius(100)
            .padding(.bottom)
        }
        .sheet(isPresented: $showSpotifyURL) {
            SharePopupView(spotifyURL: track.spotifyURL)
        }
        }
}
    

struct RatingBased: View {
    @EnvironmentObject var viewModelRec: SharedForRecommendation
    @GestureState private var dragOffset: CGFloat = 0
    @State var isRotated = false
    
    var body: some View {
    Spacer()
        VStack {
            if viewModelRec.isLoading2 {
                Spacer()
                HStack{
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
                                isRotated.toggle()
                            }
                            withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
                                isRotated.toggle()
                            }
                        }
                        .padding()
                    Text("We are bringing your recommendations for you based on your ratings!")
                        .font(.headline)
                        .padding()
                        .foregroundColor(.white)
                }.frame(width: 400, height: 530)
                Spacer()
            }
            else {
                    ZStack {
                        ForEach(viewModelRec.recommendedTracksRating.indices, id: \.self) { index in
                            Group {
                                if index == viewModelRec.currentIdx2 {
                                    TrackCardViewForRating(track: viewModelRec.recommendedTracksRating[index])
                                        .offset(x: dragOffset)
                                        .transition(.slide)
                                        .animation(.easeInOut, value: dragOffset)
                                }
                            }
                        }
                    }
                    .gesture(
                        DragGesture()
                            .updating($dragOffset, body: { value, state, _ in
                                state = value.translation.width
                            })
                            .onEnded({ value in
                                let threshold: CGFloat = 50
                                if value.translation.width > threshold {
                                    viewModelRec.currentIdx2 = max(0, viewModelRec.currentIdx2 - 1)
                                } else if value.translation.width < -threshold {
                                    viewModelRec.currentIdx2 = min(viewModelRec.recommendedTracksRating.count - 1, viewModelRec.currentIdx2 + 1)
                                }
                            })
                    )
                }
            }
        .onAppear {
            viewModelRec.fetchRecommendationsRating()
        }
    }
}

struct SharePopupView: View {
    let spotifyURL: URL
    @State var alertPresent: Bool = false

    var body: some View {
        ZStack{
            BackgroundView()
            VStack {
                Text("Share Spotify URL")
                    .foregroundColor(.indigo)
                    .bold()
                    .padding(.bottom)
                Text(spotifyURL.absoluteString)
                    .font(.caption)
                    .underline()
                    .foregroundColor(.white)
                Button("Copy to Clipboard") {
                    UIPasteboard.general.url = spotifyURL
                    alertPresent = true
                }.font(.subheadline)
                    .foregroundColor(.white)
                    .padding()
                
            }
            .frame(width: 315, height: 210)
            .background(Color.black)
            .cornerRadius(20)
            .shadow(radius: 10)
            .alert(isPresented: $alertPresent) {
                Alert(
                    title: Text("Spotify URL is copied to clipboard"),
                    message: Text("You can share it with your friends"),
                    dismissButton: .default(Text("Okay"))
                )
            }
        }
    }
}


struct Temporal: View {
    @EnvironmentObject var viewModelRec: SharedForRecommendation
    @GestureState private var dragOffset: CGFloat = 0
    @State var isRotated = false
    @State var errorMessage: String = ""
    @State private var showLyricsPopup = false
    @State private var showSpotifyURL: Bool = false
    
    var body: some View {
        Spacer()
        VStack {
            if viewModelRec.isLoading3 {
                Spacer()
                HStack{
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
                                    isRotated.toggle()
                                }
                                withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
                                    isRotated.toggle()
                                }
                            }
                            .padding()
                        Text("We are bringing your recommendations for you based on your temporal likings!")
                            .font(.headline)
                            .padding()
                            .foregroundColor(.white)
                    }.frame(width: 400, height: 530)
                Spacer()
            } else if let recommendation = viewModelRec.temporalRecommendation {
                ZStack{
                    VStack{
                        VStack(alignment: .center, spacing: 5) {
                            if let url = URL(string: recommendation.randomTrack.albumURL ?? "") {
                                AsyncImage(url: url) { phase in
                                    switch phase {
                                    case .empty:
                                        ProgressView()
                                    case .success(let image):
                                        image
                                            .resizable()
                                            .frame(width: 300, height: 430)
                                            .cornerRadius(35)
                                    case .failure:
                                        Image(systemName: "photo")
                                            .frame(width: 300, height: 430)
                                            .cornerRadius(10)
                                    @unknown default:
                                        EmptyView()
                                    }
                                }
                            }
                            
                            Text(recommendation.randomTrack.name)
                                .font(.headline)
                                .bold()
                            
                            Text(recommendation.artistName)
                                    .font(.subheadline)
                            
                            if let albumName = recommendation.randomTrack.albumName {
                                Text(albumName)
                                    .font(.caption)
                            }
                            
                        }
                        .frame(width: 350, height: 530)
                        .padding()
                        .cornerRadius(20)
                        
                        HStack (spacing: 12){
                            Button(action: {
                                viewModelRec.ShowSongInfo3(recommendation: recommendation)
                                self.showLyricsPopup = true
                                
                            }, label: {
                                VStack (spacing: 8){
                                    Image(systemName: "music.note.list")
                                        .font(.title)
                                        .foregroundColor(.indigo)
                                    
                                }
                            }).sheet(isPresented: $showLyricsPopup) {
                                LyricsPopupView()
                            }
                            
                            Button(action: {
                                viewModelRec.addToLikedSongs(trackId: recommendation.randomTrack.spotifyID, albumId: recommendation.randomTrack.album)
                            }, label: {
                                VStack (spacing: 10){
                                    Image(systemName: "heart.fill")
                                        .font(.title)
                                        .foregroundColor(.indigo)
                                }
                            }).alert(isPresented: $viewModelRec.isAdded) {
                                Alert(
                                    title: Text("Success"),
                                    message: Text("Recommended song added to liked songs successfully"),
                                    dismissButton: .default(Text("OK"))
                                )
                            }
                            
                            Button(action: {
                                self.showSpotifyURL = true
                                UIPasteboard.general.url = recommendation.randomTrack.spotifyURL
                            }, label: {
                                VStack (spacing: 8){
                                    Image(systemName: "square.and.arrow.up.fill")
                                        .font(.title)
                                        .foregroundColor(.indigo)
                                }
                            })
                        }
                        .frame(width: 300, height: 60)
                        .background(.black.opacity(0.30))
                        .cornerRadius(100)
                        .padding(.bottom)
                    }
                    .sheet(isPresented: $showSpotifyURL) {
                        SharePopupView(spotifyURL: recommendation.randomTrack.spotifyURL)
                    }
                }
            }
            else {
                Text("No recommendation available.")
            }
        }
        .onAppear {
            viewModelRec.fetchTemporalRecommendation()
        }
    }
}


