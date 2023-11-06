import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                BackgroundView()

                VStack(alignment: .center) {
                    TitleView()
                    Text("Music & More")
                        .font(.headline)

                    NavigationLink(destination: LoginView()) {
                        Text("Tap to continue")
                            .font(.caption)
                            .fontWeight(.light)
                            .opacity(0.6)
                            .padding(40.0)
                    }
                }
                .padding()
            }
        }
    }
}

struct BackgroundView: View {
    var body: some View {
        LinearGradient(colors: [.blue, .indigo, .blue, .indigo, .blue], startPoint: .topLeading, endPoint: .bottomTrailing)
            .opacity(0.4)
            .ignoresSafeArea()
    }
}

#Preview {
    ContentView()
        .preferredColorScheme(.dark)
}


struct TitleView: View {
    
    @State var isRotated: Bool = false
    
    var body: some View {
        HStack (alignment: .center){
            Text("SUPotify")
                .font(.largeTitle)
                .fontWeight(.semibold)
                .foregroundColor(Color.white)
            
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
                        isRotated.toggle() //toggle the value
                    }
                    withAnimation(Animation.linear(duration: 6).repeatForever(autoreverses: false)) {
                                isRotated.toggle()
                            }
        }
                .padding()
        }
    }
}


struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .preferredColorScheme(.dark)
    }
}
