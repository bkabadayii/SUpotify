//
//  PlaylistView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 16.11.2023.
//

import SwiftUI

struct PlaylistView: View {
    //@State var isRotated: Bool = false
    @Environment(\.presentationMode) var presentationMode
    
    var topSpacer_height:CGFloat = 400
    @State var playButton_offset:CGFloat = 335
    
    var body: some View {
        ZStack{
            
            LinearGradient(gradient: Gradient(colors:
                [Color.init(red:55/255, 
                green: 100/255, blue: 120/255),
                 Color.black,Color.black]),
               startPoint: .top, endPoint: .bottom).edgesIgnoringSafeArea(.all)
            
            // Layer 1
            VStack {
                Spacer()
                    .frame(height:50)
                Image(systemName: "music.mic")
                    .resizable()
                    .frame(width:200, height:200)
                Text("Title")
                    .foregroundColor(Color.white)
                    .font(.system(size: 24, weight: .bold))
                Text("Subtitle")
                    .foregroundColor(Color.white)
                    .font(.system(size: 16, weight: .medium))
                Spacer()
            }
            
            // Layer 2
            ScrollView {
                GeometryReader{geo -> AnyView? in
                    let thisOffset = geo.frame(in: .global).minY
                    DispatchQueue.main.async {
                        if thisOffset > -300{
                            self.playButton_offset = thisOffset
                        }
                        else{
                            self.playButton_offset = -300
                        }
                    }
                    return nil
                }
                VStack(spacing:0) {
                    
                    HStack{
                        Spacer()
                            .frame(height:topSpacer_height)
                            .background(LinearGradient(gradient:
                                Gradient(colors:
                                [Color.clear,
                                 Color.clear,
                                 Color.clear,
                                 Color.clear,
                                 Color.clear,
                                 Color.clear,
                                 Color.black]),
                               startPoint: .top, endPoint: .bottom))
                    }
                    VStack {
                        ForEach(0..<30){ i in
                            HStack{
                              LImage_RText(contentID: "", contentType: "TRACK", songName: "track", artistNames: "artists", imageURL: "https://i.scdn.co/image/ab6761610000e5eb59ba2466b22929f5e7ca21e4")
                                Spacer()
                            }
                        }
                    }.background(Color.black)
                    
                }
            }
            
           // .background(Color.black.opacity(0.5))
            VStack{
                LinearGradient(gradient: Gradient(colors:
                [Color.init(red:55/255,
                  green: 100/255, blue: 120/255), Color.clear]),
                startPoint: .top, endPoint: .bottom).frame(height:300)
                Spacer()
            }.edgesIgnoringSafeArea(.all)
            
            // Layer 3
            VStack {
                Spacer()
                    .frame(height:playButton_offset + 300)
                
                HStack{
                    if(playButton_offset > -300){
                        Text("PLAY")
                    }
                    else{
                        Image(systemName: "play.fill")
                    }
                }
                    .foregroundColor(.white)
                    .frame(width:get_playButtonWidth(), height:50)
                    .background(Color.indigo)
                    .cornerRadius(25)
                .font(.system(size: 17, weight:.bold))
                .shadow(radius: 20)
                Spacer()
            }
            // Layer 4
            
            VStack{
                HStack{
                    Image(systemName: "chevron.left")
                        .onTapGesture {
                            self.presentationMode.wrappedValue.dismiss()
                        }
                    Spacer()
                    Image(systemName: "ellipsis")
                }
                .foregroundColor(.white)
                .padding()
                Spacer()
            }
        }
        .navigationBarBackButtonHidden(true)
    }
    func get_playButtonWidth() -> CGFloat {
        if playButton_offset > -150 {
            return 240
        }
        else if playButton_offset <= -300{
            return 50
        }
        else{
            var width: CGFloat = 240 - (190*(((-1*playButton_offset) - 150) / 150))
            return width
        }
    }
}

#Preview {
    PlaylistView()
}
