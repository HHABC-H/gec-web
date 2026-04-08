import { constantRoutes } from '@/router'

describe('Router:ocean-ai', () => {
  it('contains ocean ai route under example menu', () => {
    const exampleRoute = constantRoutes.find(route => route.path === '/example')
    expect(exampleRoute).toBeTruthy()

    const oceanRoute = (exampleRoute.children || []).find(route => route.path === 'ocean-ai')
    expect(oceanRoute).toBeTruthy()
    expect(oceanRoute.meta && oceanRoute.meta.title).toBe('海洋AI问答')
  })
})

