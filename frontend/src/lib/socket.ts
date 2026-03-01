import { io, type Socket } from 'socket.io-client'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

let socket: Socket | null = null

export function connectSocket(token: string): Promise<Socket> {
  return new Promise((resolve, reject) => {
    if (socket?.connected) {
      resolve(socket)
      return
    }

    socket = io(baseUrl, {
      auth: { token },
      transports: ['websocket'],
    })

    socket.on('connect', () => resolve(socket!))
    socket.on('connect_error', (err) => reject(err))
  })
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function getSocket(): Socket | null {
  return socket
}
