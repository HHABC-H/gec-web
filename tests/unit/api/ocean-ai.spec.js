import { fetchChatStream, getChatStreamUrl } from '@/api/ocean-ai'

describe('API:ocean-ai', () => {
  it('builds chat stream url with encoded message', () => {
    const url = getChatStreamUrl('海洋 与 AI')
    expect(url).toBe('/ai/chatstream?message=%E6%B5%B7%E6%B4%8B%20%E4%B8%8E%20AI')
  })

  it('calls stream api without auth header', () => {
    const originalFetch = global.fetch
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }))

    fetchChatStream('你好')

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const [, options] = global.fetch.mock.calls[0]
    expect(options.method).toBe('GET')
    expect(options.headers).toEqual({
      'Accept': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-cache'
    })

    global.fetch = originalFetch
  })
})
