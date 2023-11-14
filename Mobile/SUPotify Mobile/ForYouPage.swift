
//  ForYouPage.swift
//  SUPotify Mobile App
//
//  Created by Deniz Özdemir on 11/9/23.
//

import SwiftUI

struct ForYouView: View {
   
    @State private var currentIdx: Int = 0
    @GestureState private var dragOffset: CGFloat = 0


    var body: some View {
        NavigationStack {
            VStack{
                ZStack{
                    BackgroundView()
                    
                        ForEach(0..<data.count, id: \.self) { index in
                          
                            VStack{
                                
                                Text("")
                                Text("")
                                Text("")
                                                        
                                Image(data[index].photo)
                                    .frame(width: 300, height: 450)
                                    .cornerRadius(35)
                                    .opacity(currentIdx == index ? 1.0 : 0.5)
                                    .scaleEffect(currentIdx == index ? 1.2 : 0.8)
                                    .offset(x: CGFloat(index - currentIdx) * 300 + dragOffset, y:0)
                            
                               Text("")
                                Text("")
                                
                                VStack{
                                    Text(data[index].sname)
                                        .font(.largeTitle)
                                        .bold()
                                        .foregroundColor(.white.opacity(10))
                                        .opacity(currentIdx == index ? 1.0 : 0.5)
                                        .scaleEffect(currentIdx == index ? 1.2 : 0.8)
                                        .offset(x: CGFloat(index - currentIdx) * 300 + dragOffset, y:0)
                                    Text(data[index].artist)
                                        .font(.subheadline)
                                        .foregroundColor(.white)
                                        .opacity(currentIdx == index ? 1.0 : 0.5)
                                        .scaleEffect(currentIdx == index ? 1.2 : 0.8)
                                        .offset(x: CGFloat(index - currentIdx) * 300 + dragOffset, y:0)
                                }
                                .frame(width: 290, height: 100)
                                .background(.black.opacity(0.10))
                                .cornerRadius(100)
                                
                            
                                Text("")
                                
                        
                                ButtonsView()
                                    
                                   
                                
                            }
                        }
                        
                }
                .gesture(DragGesture()
                    .onEnded({value in
                        let threshold: CGFloat = 50
                        if value.translation.width > threshold {
                            withAnimation{
                                currentIdx = max(0, currentIdx - 1)
                            }
                        }
                        else if value.translation.width < -threshold {
                            withAnimation {
                                currentIdx = min(data.count - 1, currentIdx + 1)
                                
                            }
                        }
                        
                    })
                
                         
                )
                
               
            }
            
        }
            .navigationTitle("Just For You")
            
                
            }
             
}

      

#Preview {
    ForYouView()
        .preferredColorScheme(.dark)
}

struct ButtonsView: View {
    
    var body: some View {
        

        HStack (spacing: 12){
        Button(action: {
            ShowSongInfo()
        }, label: {
            VStack (spacing: 8){
                Image(systemName: "music.note.list")
                    .font(.title)
                    .foregroundColor(.indigo)
                
            }
        })
        
        
        Button(action: {
            AddToLikedSongs()
        }, label: {
            VStack (spacing: 10){
                Image(systemName: "heart.fill")
                    .font(.title)
                    .foregroundColor(.indigo)
               
                
            }
        })
        
        Button(action: {
            AddToPlaylist()
        }, label: {
            VStack (spacing: 8){
                Image(systemName: "plus.circle.fill")
                    .font(.title)
                    .foregroundColor(.indigo)
                
              
            }
        })
        
        Button(action: {
            Share()
        }, label: {
            VStack (spacing: 8){
                Image(systemName: "square.and.arrow.up.fill")
                    .font(.title)
                    .foregroundColor(.indigo)
                
               
            }
        })
        }
            .frame(width: 300, height: 60)
            .background(.black.opacity(0.10))
            .cornerRadius(100)
        
           
  
    }
}

class Host: UIHostingController<ContentView> {
    override var preferredStatusBarStyle: UIStatusBarStyle{
        return .lightContent
    }
}


struct Song: Identifiable {
    var id: Int
    var artist: String
    var sname: String
    var photo: String
}

var data = [

    Song(id: 0, artist: "The Weeknd", sname: "Die For You", photo: "weeknd"),
    
    Song(id: 1, artist: "Britney Spears", sname: "Toxic", photo: "britney"),

    Song(id: 2, artist: "Fred Again", sname: "Rumble", photo: "fred"),
    
    Song(id: 3, artist: "Travis Scott", sname: "Fair Trade", photo: "travis"),
    
    Song(id: 4, artist: "Inji", sname: "Belly Dancing", photo: "inji"),

]

func ShowSongInfo(){
    
}

func AddToLikedSongs(){
    
}
func AddToPlaylist(){
    
}
func Share(){
    
}


