//  ForYouPage.swift
//  SUPotify Mobile App
//
//  Created by Deniz Özdemir on 11/9/23.
//

import SwiftUI

struct Track: Codable {
  // let id: String
    let name: String
   // let popularity: Int
   // let durationMS: Int
    let album: Album
    let artists: [Artist]
   let spotifyID: String
    let spotifyURL: URL
  //  let previewURL: URL
  //  let v: Int
}

struct Album: Codable {
    let _id: String
    let name: String
    let imageURL: String
}

struct Artist: Codable {
  // let _id: String
    let name: String
    let genres: [String]
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
    let mostPopularTracks: [Track]
}


struct ForYouView: View {
    @State private var selectedTab = 0
    @EnvironmentObject var viewModelRec: SharedForRecommendation

      var body: some View {
          ZStack{
              BackgroundView()
              VStack {
                  Picker("Options", selection: $selectedTab) {
                                         Text("Friend based").tag(0)
                                         Text("Rating based").tag(1)
                      }
                      .pickerStyle(SegmentedPickerStyle())
                      .padding()

                      if selectedTab == 0 {
                         FriendBased()
                          
                      } else {
                        RatingBased()
                      }
                 
              }}
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
    @State var errorMessage: String = ""
    @State private var showLyricsPopup = false
    @EnvironmentObject var viewModelRec: SharedForRecommendation
    @State private var showSpotifyURL: Bool = false

    var body: some View {
        VStack{
            VStack(alignment: .center, spacing: 10) {
                if let url = URL(string: track.album.imageURL ?? "") {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                        case .success(let image):
                            image
                                .resizable()
                                .frame(width: 300, height: 450)
                                .cornerRadius(35)
                        case .failure:
                            Image(systemName: "photo")
                                .frame(width: 300, height: 450)
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
                
            Text(track.album.name)
                    .font(.caption)
                
            }
            .frame(width: 350, height: 550)
            .padding()
            .cornerRadius(20)
            
            HStack (spacing: 12){
                Button(action: {
                    self.showLyricsPopup = true
                    viewModelRec.ShowSongInfo(track: track)
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
        }.onAppear{
            viewModelRec.ShowSongInfo(track: track)
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

            VStack(spacing: 15) {
                Text("Lyrics")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding(.top, 15)
                
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 14) {
                        ForEach(viewModelRec.songLyrics.split(separator: "\n"), id: \.self) { line in
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
                    }
                Spacer()
                }
            else {
                ZStack {
                    ForEach(viewModelRec.recommendedTracks.indices, id: \.self) { index in
                        Group {
                            if index == viewModelRec.currentIdx {
                                TrackCardView(track: viewModelRec.recommendedTracks[index])
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

class SharedForRecommendation: ObservableObject {
    static let shared = SharedForRecommendation()
    @Published var recommendedTracks: [Track] = []
      @Published  var isLoading = true
      @Published  var currentIdx: Int = 0
    @Published var isRotated = false
    @Published  var songLyrics: String = ""
    @Published var isAdded: Bool = false
    @Published var showErrorAlert: Bool = false
       @Published var errorMessage: String = ""
    @Published var recommendedTracksRating: [Track] = []


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
    
    func fetchRecommendationsRating() {
        let token = SessionManager.shared.token
        let url = URL(string: "http://localhost:4000/api/recommendation/recommendTrackFromUserRatings")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
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
                    print(response)
                    self.recommendedTracksRating = response.mostPopularTracks
                        print(response.mostPopularTracks)
                        self.isLoading = false
                   
                } catch {
                    print("Decoding Error: \(error.localizedDescription)")
                }
            }
            
        }.resume()
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
                    } catch {
                        print("Decoding Error: \(error.localizedDescription)")
                    }
                }
            }.resume()
    }
}
    


struct RatingBased: View {
    @EnvironmentObject var viewModelRec: SharedForRecommendation
    @GestureState private var dragOffset: CGFloat = 0
    @State var isRotated = false
    
    var body: some View {
    Spacer()
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
                      Text("We are bringing your recommendations for you based on your ratings!")
                          .font(.headline)
                          .padding()
                          .foregroundColor(.white)
                  }
              Spacer()
              }
          else {
              ZStack {
                  ForEach(viewModelRec.recommendedTracksRating.indices, id: \.self) { index in
                      Group {
                          if index == viewModelRec.currentIdx {
                              TrackCardView(track: viewModelRec.recommendedTracksRating[index])
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
                            viewModelRec.currentIdx = min(viewModelRec.recommendedTracksRating.count - 1, viewModelRec.currentIdx + 1)
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
