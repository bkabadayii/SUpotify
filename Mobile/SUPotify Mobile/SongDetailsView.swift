//
//  SongDetailsView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 6.12.2023.
//

import SwiftUI
import Foundation

struct SongDetailsView: View {
    @State private var timing: Double = 0.0
    private var songs: [Song2] = Song2.all
    @State private var selectedIndex: Int = 0

    private var selectedSong: Song2 {
        songs[selectedIndex]
    }

    var body: some View {
        ZStack {
            Color.primary
            Image(selectedSong.imageName)
                .resizable()
                .blur(radius: 15)
                .opacity(0.3)
                .background(.thinMaterial)

            VStack {
                Spacer()

                HStack {
                    TopButtonView(actionPrint: "Action", image: "chevron.down")
                        .foregroundColor(.white)

                    Spacer()

                    Text("EK Rock")
                        .foregroundStyle(.white)

                    Spacer()

                    TopButtonView(actionPrint: "More", image: "ellipsis")
                        .foregroundColor(.white)
                }
                .padding()

                Spacer()

                TabView(selection: $selectedIndex) {
                    ForEach(songs.indices, id: \.self) { index in
                        Image(songs[index].imageName)
                            .resizable()
                            .frame(maxWidth: 400, maxHeight: 400, alignment: .center)
                            .padding()
                            .tag(index)
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .never))

                songDetails

                slider

                controlButtons

                Spacer()
            }
        }
        .ignoresSafeArea()
        .onChange(of: selectedIndex) { _ in
            timing = 0.0 // Reset the timing when a new song is selected
        }
    }

    private var songDetails: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(selectedSong.title)
                    .font(.title.bold())
                    .foregroundStyle(.white)
                Text(selectedSong.artist)
                    .foregroundStyle(.regularMaterial)
            }

            Spacer()

            Button {
                print("Favorited")
            } label: {
                Image(systemName: "heart.fill")
                    .font(.title)
                    .foregroundStyle(.green)
            }
        }
        .padding()
    }

    private var slider: some View {
        Slider(value: $timing, in: 0...Double(selectedSong.time)) {
            Text("Slider")
        } minimumValueLabel: {
            Text("0:00")
        } maximumValueLabel: {
            Text("\(formattedTime(for: selectedSong.time))")
        }
        .tint(.white)
        .padding()
    }

    private var controlButtons: some View {
        HStack {
            Button {
                print("Shuffle")
            } label: {
                Image(systemName: "shuffle")
                    .font(.title)
            }
            .foregroundStyle(.white)

            Spacer()

            Button {
                withAnimation {
                    selectedIndex = max(selectedIndex - 1, 0)
                }
            } label: {
                Image(systemName: "backward.end.fill")
                    .font(.system(size: 40))
            }
            .foregroundStyle(.white)

            Spacer()

            Button {
                print("Play")
            } label: {
                Image(systemName: "play.circle.fill")
                    .font(.system(size: 90))
            }
            .foregroundStyle(.white)

            Spacer()

            Button {
                withAnimation {
                    selectedIndex = min(selectedIndex + 1, songs.count - 1)
                }
            } label: {
                Image(systemName: "forward.end.fill")
                    .font(.system(size: 40))
            }
            .foregroundStyle(.white)

            Spacer()

            Button {
                print("Repeat")
            } label: {
                Image(systemName: "repeat")
                    .font(.title)
            }
            .foregroundStyle(.white)
        }
        .padding(.bottom, 50)
        .padding(.horizontal)
    }

    private func formattedTime(for seconds: Int) -> String {
        let minutes = seconds / 60
        let remainingSeconds = seconds % 60
        return "\(minutes):\(String(format: "%02d", remainingSeconds))"
    }
}

struct TopButtonView: View {
    var actionPrint: String
    var image: String

    var body: some View {
        Button {
            print(actionPrint)
        } label: {
            Image(systemName: image)
        }
    }
}

struct Song2: Identifiable, Hashable {
    var id = UUID()
    let imageName: String
    let title: String
    let artist: String
    let time: Int
}

extension Song2 {
    static var all: [Song2] {
        return [
            Song2(imageName: "fred", title: "Rumble", artist: "Fred again.., Skrillex", time: 3 * 60),
            //Song2(imageName: "willieNelson", title: "On The Road Again", artist: "Willie Nelson", time: 3 * 60),
            //Song2(imageName: "theRazorEdge", title: "Thunderstruck", artist: "ACDC", time: 3 * 60)
        ]
    }
}

#if DEBUG
struct SongDetailsView_Previews: PreviewProvider {
    static var previews: some View {
        SongDetailsView()
    }
}
#endif
