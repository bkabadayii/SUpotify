//
//  HomeView.swift
//  SUPotify Mobile App
//
//  Created by Deniz Özdemir on 12/6/23.
//

import SwiftUI
import Charts

struct HomeView: View {
    @State private var selectedTab: StatisticCategory = .albums
    @State private var startDate: Date = Calendar.current.date(byAdding: .year, value: -1, to: Date()) ?? Date()
    @State private var endDate: Date = Date()
    @State private var genre: String = "" // Provide a default value
    @State private var selectedOption: String = "Ranking based"
    let username = SessionManager.shared.username
    let options = ["Ranking based", "Liked Songs based"]

    var body: some View {
        ZStack{
            BackgroundView()
            NavigationView {
                VStack {
                    CategoryPicker(selectedTab: $selectedTab)
                    
                    DatePickerRange(startDate: $startDate, endDate: $endDate)
                    
                    HStack{
                        TextField("Genre", text: $genre)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .padding()
                            .font(.subheadline)
                        Button("Choose") {
                            /*@START_MENU_TOKEN@*//*@PLACEHOLDER=Action@*/ /*@END_MENU_TOKEN@*/
                        }
                    }

                    Menu {
                        ForEach(options, id: \.self) { option in
                        Button(option) {
                            selectedOption = option
                        }
                            }
                        } label: {
                            Text("Select Option: \(selectedOption)")
                                .foregroundColor(.indigo)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(5)
                                .font(.subheadline)
                            }
                        .padding()
                    
                    switch selectedTab {
                    case .albums:
                        AlbumsStatisticsView(startDate: startDate, endDate: endDate)
                    case .tracks:
                        TracksStatisticsView(startDate: startDate, endDate: endDate)
                    case .artists:
                        ArtistsStatisticsView(startDate: startDate, endDate: endDate)
                    }
                    
                    Spacer()
                }
                .padding()
                .navigationTitle("Welcome, \(username)").foregroundColor(.indigo)
                .navigationBarTitleDisplayMode(.automatic)
                .foregroundColor(.indigo)
            }
        }
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

struct DatePickerRange: View {
    @Binding var startDate: Date
    @Binding var endDate: Date


    var body: some View {
        VStack {
            DatePicker("Start Date", selection: $startDate, displayedComponents: .date)
                .datePickerStyle(CompactDatePickerStyle())
                .font(.subheadline)
            DatePicker("End Date", selection: $endDate, displayedComponents: .date)
                .datePickerStyle(CompactDatePickerStyle())
                .font(.subheadline)
        }
        .padding(.horizontal)
    }
}

enum StatisticCategory: String, CaseIterable {
    case albums = "Albums"
    case tracks = "Tracks"
    case artists = "Artists"
}

// Example Views for Each Category (Replace with actual content)
struct AlbumsStatisticsView: View {
    var startDate: Date
    var endDate: Date

    var body: some View {
        Text("Albums statistics view")
            .font(.subheadline)
        // Replace with your actual UI components for displaying albums statistics
    }
}

struct TracksStatisticsView: View {
    var startDate: Date
    var endDate: Date

    var body: some View {
        
        Text("Songs statistics view")
            .font(.subheadline)
        // Replace with your actual UI components for displaying songs statistics
    }
}

struct ArtistsStatisticsView: View {
    var startDate: Date
    var endDate: Date

    var body: some View {
        Text("Artists statistics view")
            .font(.subheadline)
        // Replace with your actual UI components for displaying ratings statistics
    }
}


#Preview {
    HomeView()
        .preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}

