import SwiftUI
import Charts


struct TopRatedTracksRequest: Codable {
  let filters: Filters
  let numItems: Int
}

struct Filters: Codable {
  let rateDate: [String]
  let releaseDate: [String]
  let genres: [String]
  let artists: [String]
}


struct TopRatedArtistsRequest: Codable {
  let filters: Filters2
  let numItems: Int
}

struct Filters2: Codable {
  let rateDate: [String]
  let genres: [String]
}


struct TopRatedTracksResponse: Codable {
  var message: String
  var success: Bool
  var trackRatings: [TrackRating]?
  // var genreToRating: Genrer
  // var artistToRating: Artistr
  // var eraToRating:

  struct TrackRating: Codable {
    var track: Track
    var rating: Int
    var ratedAt: String
    var _id: String
      
    struct Track: Codable {
      var _id: String
      var name: String
      var popularity: Int?
      var durationMS: Int?
      //var album: Album
      //var artists: [Artist]
      var spotifyID: String?
      var spotifyURL: String?
      var previewURL: String?
      var __v: Int?
    }
    /*
     struct Album: Codable {
     var _id: String
     var name: String
     var releaseDate: String
     var imageURL: String
     }

     struct Artist: Codable {
     var _id: String
     var name: String
     var genres: [String]
     var popularity: Int
     var spotifyURL: String
     var imageURL: String
     }*/
  }
}

struct TopRatedAlbumsResponse: Codable {
  var message: String
  var success: Bool
  var albumRatings: [AlbumRating]?
  // var genreToRating: Genrer
  // var artistToRating: Artistr
  // var eraToRating:

  struct AlbumRating: Codable {
    var album: AlbumStat
    var rating: Int
    var ratedAt: String
    var _id: String
    struct AlbumStat: Codable {
      var _id: String
      var name: String
      var releaseDate: String
      var totalTracks: Int?
      var genres: [String]?
      var artists: [ArtistStat]
      var tracks: [String]?
      var spotifyID: String?
      var spotifyURL: String?
      var imageURL: String?
      var __v: Int?
    }

     struct ArtistStat: Codable {
     var _id: String
     var name: String
     var genres: [String]?
     var popularity: Int?
     var spotifyURL: String?
     var imageURL: String?
     }
  }
}


struct TopRatedArtistsResponse: Codable {
  var message: String
  var success: Bool
  var artistRatings: [ArtistRating]?
  // var genreToRating: Genrer

  struct ArtistRating: Codable {
    var artist: ArtistStat
    var rating: Double
    var ratedAt: String
    var _id: String

     struct ArtistStat: Codable {
     var _id: String
     var name: String
     var genres: [String]?
     var popularity: Int?
     var spotifyURL: String?
     var imageURL: String?
     }
  }
}

struct HomeView: View {
  @StateObject var homeViewModel = HomeViewModel()
  @State private var selectedTab: StatisticCategory = .tracks

  @State private var ratingStartDate = Date()
  @State private var ratingEndDate = Date()
  @State private var releaseStartDate = Date()
  @State private var releaseEndDate = Date()
  @State private var useReleaseDate: Bool = false
  @State private var useRatingDate: Bool = false


  @State private var ratingStartDateAsString: String = ""
  @State private var ratingEndDateAsString: String = ""
  @State private var releaseStartDateAsString: String = ""
  @State private var releaseEndDateAsString: String = ""

  @State private var genre: String = "" // Provide a default value
  @State private var artists: String = "" // Provide a default value
  @State private var selectedOption: String = "Ranking based"
  let username = SessionManager.shared.username
  let userToken = SessionManager.shared.token
  let options = ["Ranking based", "Liked Songs based"]

  var body: some View {
    ZStack{
      BackgroundView()
      VStack {
        CategoryPicker(selectedTab: $selectedTab)

        Divider()

        Toggle(isOn: $useRatingDate, label: {
          Text("Filter on Your Rating Date:")
            .font(.system(size: 18, weight: .bold))
        })
        //Divider()

        HStack {
          Spacer()
          Text("From:")
            .font(.system(size: 14))
            DatePicker("", selection: $ratingStartDate, in: ...Date() , displayedComponents: .date)
            .onChange(of: ratingStartDate) { newValue in
                    self.ratingStartDateAsString = formatToYearMonth(newValue)
                }
            .padding(.trailing)
          Text("To:")
            .font(.system(size: 14))
            DatePicker("", selection: $ratingEndDate, in: ...Date() , displayedComponents: .date)
            .onChange(of: ratingEndDate) { newValue in
                    self.ratingEndDateAsString = formatToYearMonth(newValue)
                }
            .padding(.trailing)
        }
        .padding(.top)
        .padding(.bottom)

        Divider()

        Toggle(isOn: $useReleaseDate, label: {
          Text("Filter on Release Dates:")
            .font(.system(size: 18, weight: .bold))
        })

        //Divider()

        HStack {
          Spacer()
          Text("From:")
            .font(.system(size: 14))
          DatePicker("", selection: $releaseStartDate, in: ...Date() , displayedComponents: .date)
            .onChange(of: releaseStartDate) { newValue in
                    self.releaseStartDateAsString = formatToYearMonth(newValue)
                }
            .padding(.trailing)
          Text("To:")
            .font(.system(size: 14))
          DatePicker("", selection: $releaseEndDate, in: ...Date() , displayedComponents: .date)
            .onChange(of: releaseEndDate) { newValue in
                    self.releaseEndDateAsString = formatToYearMonth(newValue)
                }
            .padding(.trailing)
        }
        .padding(.top)
        .padding(.bottom)

        /*
        HStack{
          TextField("Genre", text: $genre)
            .textFieldStyle(RoundedBorderTextFieldStyle())
            .padding()
            .font(.subheadline)
          TextField("Artist", text: $artists)
            .textFieldStyle(RoundedBorderTextFieldStyle())
            .padding()
            .font(.subheadline)
        }*/

        Menu {
          ForEach(options, id: \.self) { option in
            Button(option) {
              selectedOption = option
            }
          }
        } label: {
          Text("Select Option: \(selectedOption)")
            .foregroundColor(.white)
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(5)
            .font(.subheadline)
        }
        .padding()

        switch selectedTab {
        case .tracks:
          TracksStatisticsView(ratingStartDateAsString: $ratingStartDateAsString, ratingEndDateAsString: $ratingEndDateAsString, releaseStartDateAsString: $releaseStartDateAsString, releaseEndDateAsString: $releaseEndDateAsString, genre: genre, artists: artists, numItems: 10, homeViewModel: homeViewModel)
        case .albums:
          AlbumsStatisticsView(ratingStartDateAsString: $ratingStartDateAsString, ratingEndDateAsString: $ratingEndDateAsString, releaseStartDateAsString: $releaseStartDateAsString, releaseEndDateAsString: $releaseEndDateAsString, genre: genre, artists: artists, numItems: 10, homeViewModel: homeViewModel)
        case .artists:
          ArtistsStatisticsView(startDateAsString: $releaseStartDateAsString, endDateAsString: $releaseEndDateAsString, genre: genre, numItems: 10, homeViewModel: homeViewModel)
        }

        Spacer()
      }
      .padding()
      .navigationTitle("Welcome, \(username)").foregroundColor(.indigo)
      .navigationBarTitleDisplayMode(.automatic)
      .foregroundColor(.indigo)
    }
  }


  func formatToYearMonth(_ date: Date) -> String {
      let dateFormatter = DateFormatter()
      dateFormatter.dateFormat = "YYYY-MM"
      return dateFormatter.string(from: date)
  }
}

class HomeViewModel: ObservableObject {
  @Published var topRatedTracksResponse: TopRatedTracksResponse?
  @Published var topRatedAlbumsResponse: TopRatedAlbumsResponse?
  @Published var topRatedArtistsResponse: TopRatedArtistsResponse?
  @Published var showBarChart = false

  func fetchTopRatedTracks(userToken: String, ratingStartDateAsString: String, ratingEndDateAsString: String, releaseStartDateAsString: String, releaseEndDateAsString: String, genre: String, artists: String, numItems: Int) {

    let requestBody = TopRatedTracksRequest(
      filters: Filters(
        rateDate: [ratingStartDateAsString, ratingEndDateAsString],
        releaseDate: [releaseStartDateAsString, releaseEndDateAsString],
        genres: genre.isEmpty ? [] : [genre],
        artists: artists.isEmpty ? [] : artists.components(separatedBy: ",") // Assuming you have a way to specify artists
      ),
      numItems: numItems
    )
    guard let url = URL(string: "http://localhost:4000/api/statistics/getTopRatedTracks") else { return }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")

    do {
      request.httpBody = try JSONEncoder().encode(requestBody)
    } catch {
      print("Error encoding request body: \(error)")
      return
    }

    URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
      DispatchQueue.main.async {
        if let error = error {
          print("Error: \(error)")
          return
        }
        guard let data = data else {
          print("No data received")
          return
        }
        // Print raw JSON string for debugging
        if let json = String(data: data, encoding: .utf8) {
          print("Raw JSON response: \(json)")
        }
        do {
          let decodedResponse = try JSONDecoder().decode(TopRatedTracksResponse.self, from: data)
          self?.topRatedTracksResponse = decodedResponse
          self?.showBarChart = true
          //print(decodedResponse)
        } catch {
          print("Error decoding response: \(error)")
        }
      }
    }.resume()
  }

  func fetchTopRatedAlbums(userToken: String, ratingStartDateAsString: String, ratingEndDateAsString: String, releaseStartDateAsString: String, releaseEndDateAsString: String, genre: String, artists: String, numItems: Int){
    let requestBody = TopRatedTracksRequest( // Request body same as tracks
      filters: Filters(
        rateDate: [ratingStartDateAsString, ratingEndDateAsString],
        releaseDate: [releaseStartDateAsString, releaseEndDateAsString],
        genres: genre.isEmpty ? [] : [genre],
        artists: artists.isEmpty ? [] : artists.components(separatedBy: ",")
      ),
      numItems: numItems
    )
    guard let url = URL(string: "http://localhost:4000/api/statistics/getTopRatedAlbums") else { return }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")

    do {
      request.httpBody = try JSONEncoder().encode(requestBody)
    } catch {
      print("Error encoding request body: \(error)")
      return
    }

    URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
      DispatchQueue.main.async {
        if let error = error {
          print("Error: \(error)")
          return
        }
        guard let data = data else {
          print("No data received")
          return
        }
        // Print raw JSON string for debugging
        if let json = String(data: data, encoding: .utf8) {
          print("Raw JSON response: \(json)")
        }
        do {
          let decodedResponse = try JSONDecoder().decode(TopRatedAlbumsResponse.self, from: data)
          self?.topRatedAlbumsResponse = decodedResponse
          self?.showBarChart = true
          print(decodedResponse)
        } catch {
          print("Error decoding response: \(error)")
        }
      }
    }.resume()
  }

  func fetchTopRatedArtists(userToken: String, startDateAsString: String, endDateAsString: String, genre: String, numItems: Int){
    let requestBody = TopRatedArtistsRequest(
      filters: Filters2(
        rateDate: [startDateAsString, endDateAsString],
        genres: genre.isEmpty ? [] : [genre]
      ),
      numItems: numItems
    )
    guard let url = URL(string: "http://localhost:4000/api/statistics/getTopRatedArtists") else { return }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")

    do {
      request.httpBody = try JSONEncoder().encode(requestBody)
    } catch {
      print("Error encoding request body: \(error)")
      return
    }

    URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
      DispatchQueue.main.async {
        if let error = error {
          print("Error: \(error)")
          return
        }
        guard let data = data else {
          print("No data received")
          return
        }
        // Print raw JSON string for debugging
        if let json = String(data: data, encoding: .utf8) {
          print("Raw JSON response: \(json)")
        }
        do {
          let decodedResponse = try JSONDecoder().decode(TopRatedArtistsResponse.self, from: data)
          self?.topRatedArtistsResponse = decodedResponse
          self?.showBarChart = true
          print(decodedResponse)
        } catch {
          print("Error decoding response: \(error)")
        }
      }
    }.resume()
  }
}


struct CategoryPicker: View {
  @Binding var selectedTab: StatisticCategory

  var body: some View {
    Picker("Statistics Type", selection: $selectedTab) {
      ForEach(StatisticCategory.allCases, id: \.self) { category in
        Text(category.rawValue).tag(category)
      }
    }
    .pickerStyle(SegmentedPickerStyle())
    .padding()

  }
}

struct BarChartView2: View {
    var trackRatings: [TopRatedTracksResponse.TrackRating]
    @State private var barWidths: [String: CGFloat] = [:]

    // Sorting the track ratings by rating in descending order
    var sortedTrackRatings: [TopRatedTracksResponse.TrackRating] {
        trackRatings.sorted { $0.rating > $1.rating }
    }

    var body: some View {
      ZStack {
        BackgroundView()
        VStack(alignment: .leading) {
              Text("Top Rated Tracks")
                  .font(.headline)
                  .padding()

              // Creating rows for each track rating
              ForEach(sortedTrackRatings, id: \.track._id) { trackRating in
                  HStack(alignment: .center) {
                      Text(trackRating.track.name)
                          .font(.caption)
                          .frame(width: 100, alignment: .leading)

                      // Using GeometryReader to animate the bar's width
                      GeometryReader { geometry in
                          HStack {
                              Rectangle()
                                  .fill(trackRating.rating > 3 ? Color.blue : Color.red)
                                  .frame(width: self.barWidths[trackRating.track._id, default: 0], height: 20)
                                  .onAppear {
                                      withAnimation(.easeOut(duration: 1.5)) {
                                          self.barWidths[trackRating.track._id] = CGFloat(trackRating.rating) / CGFloat(sortedTrackRatings.first?.rating ?? 1) * geometry.size.width
                                      }
                                  }
                              Spacer()
                          }
                      }
                      Text("\(trackRating.rating)")
                          .font(.caption)
                          .foregroundColor(.white)
                          .frame(width: 30, alignment: .center)
                  }
                  .frame(height: 30)
              }
          }
        .padding(.horizontal)
      }
    }
}


struct BarChartView3: View {
    var albumRatings: [TopRatedAlbumsResponse.AlbumRating]
    @State private var barWidths: [String: CGFloat] = [:]

    var body: some View {
        ZStack {
            // Assuming BackgroundView() is a view you have defined elsewhere
            BackgroundView()
            VStack(alignment: .leading) {
                Text("Top Rated Albums")
                    .font(.headline)
                    .padding()

                // Creating rows for each album rating
                ForEach(sortedAlbumRatings) { albumRating in
                    HStack(alignment: .center) {
                        Text(albumRating.album.name)
                            .font(.caption)
                            .frame(width: 100, alignment: .leading)

                        GeometryReader { geometry in
                            HStack {
                                Rectangle()
                                    .fill(albumRating.rating > 3 ? Color.blue : Color.red)
                                    .frame(width: barWidth(for: albumRating, in: geometry), height: 20)
                                    .animation(.easeOut(duration: 1.5), value: barWidths[albumRating.id])
                                Spacer()
                            }
                        }
                        .frame(height: 20)

                        Text("\(albumRating.rating)")
                            .font(.caption)
                            .foregroundColor(.white)
                            .frame(width: 30, alignment: .center)
                    }
                    .frame(height: 30)
                }
            }
            .padding(.horizontal)
        }
    }

    // Sorted album ratings
    private var sortedAlbumRatings: [TopRatedAlbumsResponse.AlbumRating] {
        albumRatings.sorted { $0.rating > $1.rating }
    }

    // Calculate bar width
    private func barWidth(for albumRating: TopRatedAlbumsResponse.AlbumRating, in geometry: GeometryProxy) -> CGFloat {
        let width = CGFloat(albumRating.rating) / CGFloat(sortedAlbumRatings.first?.rating ?? 1) * geometry.size.width
        DispatchQueue.main.async {
            barWidths[albumRating.id] = width
        }
        return barWidths[albumRating.id, default: 0]
    }
}


struct BarChartView4: View {
    var artistRatings: [TopRatedArtistsResponse.ArtistRating]
    @State private var barWidths: [String: CGFloat] = [:]

    var body: some View {
        ZStack {
            BackgroundView() // Assuming this is a view you have defined elsewhere
            VStack(alignment: .leading) {
                Text("Top Rated Artists")
                    .font(.headline)
                    .padding()

                // Creating rows for each artist rating
                ForEach(sortedArtistRatings) { artistRating in
                    HStack(alignment: .center) {
                        Text(artistRating.artist.name)
                            .font(.caption)
                            .frame(width: 100, alignment: .leading)

                        GeometryReader { geometry in
                            HStack {
                                Rectangle()
                                    .fill(artistRating.rating > 3 ? Color.blue : Color.red)
                                    .frame(width: self.barWidth(for: artistRating, in: geometry), height: 20)
                                    .animation(.easeOut(duration: 1.5), value: barWidths[artistRating.id])
                                Spacer()
                            }
                        }
                        .frame(height: 20)

                      let rating: Double = artistRating.rating
                      let ratingString = String(format: "%.0f", rating)
                        Text("\(ratingString)")
                            .font(.caption)
                            .foregroundColor(.white)
                            .frame(width: 30, alignment: .center)
                    }
                    .frame(height: 30)
                }
            }
            .padding(.horizontal)
        }
    }

    // Sorted artist ratings
    private var sortedArtistRatings: [TopRatedArtistsResponse.ArtistRating] {
        artistRatings.sorted { $0.rating > $1.rating }
    }

    // Calculate bar width
    private func barWidth(for artistRating: TopRatedArtistsResponse.ArtistRating, in geometry: GeometryProxy) -> CGFloat {
        let width = CGFloat(artistRating.rating) / CGFloat(sortedArtistRatings.first?.rating ?? 1) * geometry.size.width
        DispatchQueue.main.async {
            barWidths[artistRating.id] = width
        }
        return barWidths[artistRating.id, default: 0]
    }
}


struct DatePickerRange: View {
  @Binding var startDate: Date
  @Binding var endDate: Date

  var body: some View {
    VStack {
      DatePicker("Start Date", selection: $startDate, displayedComponents: .date)
        .datePickerStyle(CompactDatePickerStyle())
        .font(.subheadline)
        .foregroundColor(.white)
      DatePicker("End Date", selection: $endDate, displayedComponents: .date)
        .datePickerStyle(CompactDatePickerStyle())
        .font(.subheadline)
        .foregroundColor(.white)
    }
    .padding(.horizontal)
  }
}

/*
struct MonthYearPicker: View {
  @Binding var selectedMonth: Int
  @Binding var selectedYear: Int
  @Binding var selectedDateAsString: String
  private let months = Calendar.current.monthSymbols

  private var years: [Int] {
    let currentYear = Calendar.current.component(.year, from: Date())
    return Array(currentYear-20...currentYear)
  }

  var body: some View {
    HStack {
      Picker("Month", selection: $selectedMonth) {
        ForEach(1...12, id: \.self) { month in
          Text(self.months[month - 1]).tag(month)
        }
      }
      .pickerStyle(WheelPickerStyle())
      .onChange(of: selectedMonth) { _ in updateDateAsString() }

      Picker("Year", selection: $selectedYear) {
        ForEach(years, id: \.self) { year in
          Text("\(year)").tag(year)
        }
      }
      .pickerStyle(WheelPickerStyle())
      .onChange(of: selectedYear) { _ in updateDateAsString() }
    }
  }

  private func updateDateAsString() {
    selectedDateAsString = "\(selectedYear)-\(selectedMonth)"
  }
}*/


enum StatisticCategory: String, CaseIterable {
  case tracks = "Tracks"
  case albums = "Albums"
  case artists = "Artists"
}

struct TracksStatisticsView: View {
  @Binding var ratingStartDateAsString: String
  @Binding var ratingEndDateAsString: String
  @Binding var releaseStartDateAsString: String
  @Binding var releaseEndDateAsString: String
  var genre: String
  var artists: String
  var numItems: Int
  let userToken = SessionManager.shared.token
  @ObservedObject var homeViewModel: HomeViewModel
  @State private var navigateToBarChart = false

  var body: some View {
    VStack {
      Button("Calculate") {
        let filters = Filters(
          rateDate: [ratingStartDateAsString, ratingEndDateAsString],
          releaseDate: [releaseStartDateAsString, releaseEndDateAsString],
          genres: [genre],
          artists: [artists]
        )
        let request = TopRatedTracksRequest(filters: filters, numItems: 10)
        homeViewModel.fetchTopRatedTracks(userToken: userToken, ratingStartDateAsString: ratingStartDateAsString, ratingEndDateAsString: ratingEndDateAsString, releaseStartDateAsString: releaseStartDateAsString, releaseEndDateAsString: releaseEndDateAsString, genre: genre, artists: artists, numItems: numItems)

        //self.showBarChart = true
      }.font(.subheadline)
        .padding()
        .background(.black.opacity(0.5))
        .foregroundColor(.white)
        .font(.caption2)
        .cornerRadius(8)


      NavigationLink(destination: BarChartView2(trackRatings: homeViewModel.topRatedTracksResponse?.trackRatings ?? []),
                     isActive: $navigateToBarChart) {
        //EmptyView()
      }
       .onReceive(homeViewModel.$showBarChart) { showChart in
         if showChart {
           self.navigateToBarChart = true

           DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
               homeViewModel.showBarChart = false
           }
         }
       }
      Spacer()
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(Color.clear)
    .edgesIgnoringSafeArea(.all)
  }
}


struct AlbumsStatisticsView: View {
  @Binding var ratingStartDateAsString: String
  @Binding var ratingEndDateAsString: String
  @Binding var releaseStartDateAsString: String
  @Binding var releaseEndDateAsString: String
  var genre: String
  var artists: String
  var numItems: Int
  let userToken = SessionManager.shared.token
  @ObservedObject var homeViewModel: HomeViewModel
  @State private var navigateToBarChart = false

  var body: some View {
    VStack {
      Button("Calculate") {
        let filters = Filters(
          rateDate: [ratingStartDateAsString, ratingEndDateAsString],
          releaseDate: [releaseStartDateAsString, releaseEndDateAsString],
          genres: [genre],
          artists: [artists]
        )
        let request = TopRatedTracksRequest(filters: filters, numItems: 10) // Request body is the same as tracks.
        homeViewModel.fetchTopRatedAlbums(userToken: userToken, ratingStartDateAsString: ratingStartDateAsString, ratingEndDateAsString: ratingEndDateAsString, releaseStartDateAsString: releaseStartDateAsString, releaseEndDateAsString: releaseEndDateAsString, genre: genre, artists: artists, numItems: numItems)

      }.font(.subheadline)
        .padding()
        .background(.black.opacity(0.5))
        .foregroundColor(.white)
        .font(.caption2)
        .cornerRadius(8)


      NavigationLink(destination: BarChartView3(albumRatings: homeViewModel.topRatedAlbumsResponse?.albumRatings ?? []),
                     isActive: $navigateToBarChart) {
        //EmptyView()
      }
       .onReceive(homeViewModel.$showBarChart) { showChart in
         if showChart {
           self.navigateToBarChart = true

           DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
               homeViewModel.showBarChart = false
           }
         }
       }
      Spacer()
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(Color.clear)
    .edgesIgnoringSafeArea(.all)
  }
}



struct ArtistsStatisticsView: View {
  @Binding var startDateAsString: String
  @Binding var endDateAsString: String
  var genre: String
  //var artists: String
  var numItems: Int
  let userToken = SessionManager.shared.token
  @ObservedObject var homeViewModel: HomeViewModel
  @State private var navigateToBarChart = false

  var body: some View {
    VStack {
      Button("Calculate") {
        let filters = Filters2(
          rateDate: [startDateAsString, endDateAsString],
          genres: [genre]
        )
        let request = TopRatedArtistsRequest(filters: filters, numItems: 10)
        homeViewModel.fetchTopRatedArtists(userToken: userToken, startDateAsString: startDateAsString, endDateAsString: endDateAsString, genre: genre, numItems: numItems)

        //self.showBarChart = true
      }.font(.subheadline)
        .padding()
        .background(.black.opacity(0.5))
        .foregroundColor(.white)
        .font(.caption2)
        .cornerRadius(8)


      NavigationLink(destination: BarChartView4(artistRatings: homeViewModel.topRatedArtistsResponse?.artistRatings ?? []),
                     isActive: $navigateToBarChart) {
        //EmptyView()
      }
       .onReceive(homeViewModel.$showBarChart) { showChart in
         if showChart {
           self.navigateToBarChart = true

           DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
               homeViewModel.showBarChart = false
           }
         }
       }
      Spacer()
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(Color.clear)
    .edgesIgnoringSafeArea(.all)
  }
}


extension TopRatedTracksResponse.TrackRating: Identifiable {
    public var id: String { self._id }
}

extension TopRatedAlbumsResponse.AlbumRating: Identifiable {
    public var id: String { self._id }
}

extension TopRatedArtistsResponse.ArtistRating: Identifiable {
    public var id: String { self._id }
}




#Preview {
  HomeView()
    .preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}

