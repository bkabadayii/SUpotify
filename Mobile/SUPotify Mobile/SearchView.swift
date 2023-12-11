import SwiftUI

struct SearchResult: Codable {
  let message : String
  let success : Bool
  let data : Data
}

struct Data: Codable {
  let Tracks: [Tracks]?
  let Albums: [Albums]?
  let Artists: [Artists]?
}

struct Tracks: Codable {
  let name: String
  let id: String
  let artists: [String]
  let albumName: String
  let albumID : String
  let image: String?
}

struct Artists: Codable {
  let name : String
  let id: String
  let image: String?
}

struct Albums: Codable {
  let name : String
  let id: String
  let artists: [String]
  let image: String?
}

struct SearchView: View {
    @ObservedObject var searchViewModel = SearchViewModel()
  @EnvironmentObject var viewModel: LikedSongsViewModel
    @State private var searchTerm = ""
    @State private var hasSearched = false

    var body: some View {

        NavigationStack {
            ZStack {
                BackgroundView()
                VStack {
                    HStack(){
                        TextField("Type a song, artist or album name", text: $searchTerm)
                            .padding(10)
                            .padding(.horizontal, 25)
                            .background(Color(.systemGray6))
                            .cornerRadius(5)
                            .font(.subheadline)
                            .autocapitalization(.none)
                            .overlay(
                                HStack {
                                    Image(systemName: "magnifyingglass")
                                        .foregroundColor(.gray)
                                        .frame(minWidth: 0, maxWidth: .infinity, alignment: .leading)
                                        .padding(.leading, 10)
                                        .font(.caption)

                                    if !searchTerm.isEmpty {
                                        Button(action: {
                                            self.searchTerm = ""
                                        }) {
                                            Image(systemName: "multiply.circle.fill")
                                                .foregroundColor(.gray)
                                                .padding(.trailing, 8)
                                                .font(.caption)
                                        }
                                    }
                                }
                            )
                            .padding(.horizontal, 10)
                      NavigationLink(destination: AddCustomSong().environmentObject(viewModel)){
                        Image(systemName: "plus.circle")
                          .foregroundColor(.white)
                          .padding(.vertical, 10)
                          .padding(.horizontal, 20)
                          //.background(Color.indigo.opacity(0.5))
                          //.cornerRadius(50)
                      }

                    }
                    .padding(.horizontal, 10)
                    .onChange(of: searchTerm) { newValue in
                        hasSearched = true
                        searchViewModel.performSearch(with: newValue)
                    }
                    .alert(isPresented: $searchViewModel.showAlert) {
                                Alert(title: Text("Error Adding Song"), message: Text(searchViewModel.alertMessage), dismissButton: .default(Text("OK")))
                    }


                    if searchViewModel.isLoading {
                        ProgressView(isRotated: true)
                    }

                    else {
                        if searchTerm.isEmpty {
                            EmptyStateView()
                        } else if !hasSearched {
                            EmptyStateView()

                        } else if searchViewModel.isNotFound {
                            NoResultsView()
                        }
                        else {
                            ResultsListView(searchViewModel: searchViewModel)
                            .environmentObject(viewModel)
                        }
                    }
                }

            }
            .navigationBarTitle("Music Search")
        }
    }


    struct EmptyStateView: View {
        @State var isRotated: Bool = true
        var body: some View {

            NavigationStack{
                VStack {

                    Spacer()
                    Image(systemName: "music.note")
                        .font(.system(size:85))
                        .padding(.bottom)
                        .foregroundColor(.white.opacity(0.70))

                    Text("Start searching for music...")
                        .font(.title)
                    Spacer()

                }
                .padding()
                .foregroundColor(.white.opacity(0.70))
            }
            .navigationBarTitle("Music Search")
        }
    }

    struct NoResultsView: View {
        var body: some View {
            VStack {
                Spacer()
                Text("No results found :(")
                    .foregroundColor(.secondary)
                    .padding()
                Spacer()
            }
        }
    }


    struct ResultsListView: View {
        @ObservedObject var searchViewModel: SearchViewModel

      @EnvironmentObject var viewModel: LikedSongsViewModel

        var body: some View {
            List {
                if !searchViewModel.tracks.isEmpty {
                    Section(header: Text("Tracks").foregroundStyle(.indigo).font(.largeTitle)) {
                        ForEach(searchViewModel.tracks, id: \.id) { track in
                            HStack{
                                if(track.image == nil){
                                    Image(systemName: "music.note")
                                        .resizable()
                                        .frame(width: 50, height: 50)
                                        .cornerRadius(8)
                                        .foregroundColor(.gray)
                                }
                                else{
                                    AsyncImage(url: URL(string: (track.image)!)) { image in
                                        image.resizable()
                                    } placeholder: {
                                        Color.gray
                                    }
                                    .frame(width: 50, height: 50)
                                    .cornerRadius(8)
                                }

                                VStack (alignment: .leading) {
                                    Text(track.name)
                                        .fontWeight(.medium)
                                    Text(track.artists[0])
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }

                                Spacer()

                                Image(systemName: "plus.circle.fill")
                                    .padding()
                                    .foregroundColor(.indigo)
                                    .onTapGesture {
                                        //Handle add to playlist
                                    }

                                Image(systemName: searchViewModel.favoritedTracks.contains(track.id) ? "heart.fill" : "heart")
                                    .foregroundColor(.pink)
                                    .onTapGesture {
                                      searchViewModel.addTrackToLikedSongs(trackId: track.id, albumId: track.albumID)
                                    }

                            }
                        }
                    }

                }

                if !searchViewModel.artists.isEmpty {
                    Section(header: Text("Artists").font(.largeTitle).foregroundStyle(.indigo)) {
                        ForEach(searchViewModel.artists, id: \.id) { artists in

                            HStack{
                                if(artists.image == nil){
                                    Image(systemName: "music.mic")
                                        .resizable()
                                        .frame(width: 50, height: 50)
                                        .cornerRadius(8)
                                        .foregroundColor(.gray)
                                }
                                else{
                                    AsyncImage(url: URL(string: artists.image!)) { image in
                                        image.resizable()
                                    } placeholder: {
                                        Color.gray
                                    }
                                    .frame(width: 50, height: 50)
                                    .cornerRadius(8)

                                }
                                Text(artists.name)
                                    .font(.subheadline)
                                Spacer()

                                Image(systemName: searchViewModel.favoritedArtists.contains(artists.id) ? "heart.fill" : "heart")
                                    .foregroundColor(.pink)
                                    .onTapGesture {
                                      searchViewModel.addArtistToLikedArtists(artistID: artists.id)
                                    }
                            }

                        }
                    }
                }

                if !searchViewModel.albums.isEmpty {
                    Section(header: Text("Albums").font(.largeTitle).foregroundStyle(.indigo)) {
                        ForEach(searchViewModel.albums, id: \.id) { album in
                            HStack{
                                if(album.image == nil){
                                    Image(systemName: "music.quarternote.3")
                                        .resizable()
                                        .frame(width: 50, height: 50)
                                        .cornerRadius(8)
                                }
                                else {
                                    AsyncImage(url: URL(string: album.image!)) { image in
                                        image.resizable()
                                    } placeholder: {
                                        Color.gray
                                    }
                                    .frame(width: 50, height: 50)
                                    .cornerRadius(8)
                                }

                                VStack (alignment: .leading){
                                    Text(album.name)
                                        .font(.subheadline)
                                    Text(album.artists[0])
                                        .font(.caption)
                                }
                                Spacer()

                                Image(systemName: "plus.circle.fill")
                                    .padding()
                                    .foregroundColor(.indigo)
                                    .onTapGesture{
                                        //Handle add to playlist
                                    }

                                Image(systemName: searchViewModel.favoritedAlbums.contains(album.id) ? "heart.fill" : "heart")
                                    .foregroundColor(.pink)
                                    .onTapGesture {
                                      searchViewModel.addAlbumToLikedAlbums(albumID: album.id)
                                    }
                            }

                        }
                    }
                }
            }
        }
    }

    /*
    struct SearchView_Previews: PreviewProvider {
        static var previews: some View {
            SearchView()
                .preferredColorScheme(.dark)

        }
    }
  */


    struct ProgressView : View {
        @State var isRotated : Bool
        var body: some View {
            ZStack{
                BackgroundView()
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
                            isRotated.toggle()
                        }
                        withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
                            isRotated.toggle()
                        }
                    }
            }
        }
    }

    class SearchViewModel: ObservableObject {
        //static let shared = LikedSongsViewModel()
        //private var likedSongsViewModel: LikedSongsViewModel
        private var token : String
        @Published var tracks: [Tracks] = []
        @Published var artists: [Artists] = []
        @Published var albums: [Albums] = []
        @Published var isLoading = false
        @Published var favoritedTracks: Set<String> = []
        @Published var favoritedArtists: Set<String> = []
        @Published var favoritedAlbums: Set<String> = []
        @Published var isNotFound: Bool = false
        @Published var showAlert = false
        @Published var alertMessage = ""



      init() {
            self.token = SessionManager.shared.token
          //self.likedSongsViewModel = likedSongsViewModel
        }


        func toggleFavorite(for trackId: String) {
            if favoritedTracks.contains(trackId) {
                favoritedTracks.remove(trackId)
            } else {
                favoritedTracks.insert(trackId)
            }
        }

        func toggleFavoriteArtist(for artisId: String) {
            if favoritedArtists.contains(artisId) {
                favoritedArtists.remove(artisId)
            } else {
                favoritedArtists.insert(artisId)
            }
        }

        func toggleFavoriteAlbum(for albumId: String) {
            if favoritedAlbums.contains(albumId) {
                favoritedAlbums.remove(albumId)
            } else {
                favoritedAlbums.insert(albumId)
            }
        }

        func performSearch(with searchTerm: String) {
            guard !searchTerm.isEmpty else {
                self.tracks = []
                self.artists = []
                self.albums = []
                self.isNotFound = false
                return
            }

            let encodedSearchTerm = searchTerm.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
            let urlString = "http://localhost:4000/api/getFromSpotify/search/:\(encodedSearchTerm)"


            guard let url = URL(string: urlString) else { return }

            isLoading = true
            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")



            URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
                DispatchQueue.main.async {
                    self?.isLoading = false

                    if let data = data, let responseString = String(data: data, encoding: .utf8) {
                        print(responseString)
                        do {
                            let searchResult = try JSONDecoder().decode(SearchResult.self, from: data)
                            self?.tracks = searchResult.data.Tracks ?? []
                            self?.artists = searchResult.data.Artists ?? []
                            self?.albums = searchResult.data.Albums ?? []
                            self?.isNotFound = self?.tracks.isEmpty ?? true &&
                            self?.artists.isEmpty ?? true &&
                            self?.albums.isEmpty ?? true

                        } catch {
                            print("Decoding error: \(error)")
                            self?.isNotFound = true

                        }
                    }
                    else{
                        self?.isNotFound = true
                    }
                }

            }.resume()

        }

        func addTrackToLikedSongs(trackId: String, albumId: String) {
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

            URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
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
                                                if let responseData = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                                                   let message = responseData["message"] as? String {
                                                    DispatchQueue.main.async {
                                                        if let success = responseData["success"] as? Bool, !success {
                                                            // If the song already exists in liked songs
                                                            self?.alertMessage = message
                                                            self?.showAlert = true
                                                        } else {
                                                            self?.toggleFavorite(for: trackId)
                                                        }
                                                    }
                                                } else {
                                                    print("Unexpected response format or data")
                                                }
                                            } catch {
                                                print("Error decoding response data: \(error)")
                                            }
                            }.resume()
                        }


        func addArtistToLikedArtists(artistID: String) {
            let urlString = "http://localhost:4000/api/likedContent/likeArtistBySpotifyID"
            guard let url = URL(string: urlString) else { return }
            print(artistID)
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

            let body: [String: Any] = [
                "spotifyID": artistID
            ]

            do {
                request.httpBody = try JSONSerialization.data(withJSONObject: body)
            } catch {
                print("Error creating request body: \(error)")
                return
            }

            URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
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
                                                if let responseData = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                                                   let message = responseData["message"] as? String {
                                                    DispatchQueue.main.async {
                                                        if let success = responseData["success"] as? Bool, !success {
                                                            // If the song already exists in liked songs
                                                            self?.alertMessage = message
                                                            self?.showAlert = true
                                                        } else {
                                                            self?.toggleFavoriteArtist(for: artistID)
                                                        }
                                                    }
                                                } else {
                                                    print("Unexpected response format or data")
                                                }
                                            } catch {
                                                print("Error decoding response data: \(error)")
                                            }
                            }.resume()
                        }

        func addAlbumToLikedAlbums(albumID: String) {
            let urlString = "http://localhost:4000/api/likedContent/likeAlbumBySpotifyID"
            guard let url = URL(string: urlString) else { return }
            print(albumID)
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

            let body: [String: Any] = [
                "spotifyID": albumID
            ]

            do {
                request.httpBody = try JSONSerialization.data(withJSONObject: body)
            } catch {
                print("Error creating request body: \(error)")
                return
            }

            URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
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
                                                if let responseData = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                                                   let message = responseData["message"] as? String {
                                                    DispatchQueue.main.async {
                                                        if let success = responseData["success"] as? Bool, !success {
                                                            // If the song already exists in liked songs
                                                            self?.alertMessage = message
                                                            self?.showAlert = true
                                                        } else {
                                                            self?.toggleFavoriteAlbum(for: albumID)
                                                        }
                                                    }
                                                } else {
                                                    print("Unexpected response format or data")
                                                }
                                            } catch {
                                                print("Error decoding response data: \(error)")
                                            }
                            }.resume()
                        }

    }
}

/*#Preview {
  SearchView().preferredColorScheme(.dark)
}
*/
