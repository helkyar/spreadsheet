import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  fallback?: ReactNode
  main?: boolean
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(/* error */): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(/* error, info */) {
    // logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      else return <DefaultFallback main={this.props.main} />
    }

    return this.props.children
  }
}

export default ErrorBoundary

function DefaultFallback({ main }: { main?: boolean }) {
  return (
    <section className={`${main && 'main'} error-boundary flex-center`}>
      <h2>Something went wrong</h2>
      <a className='button' href='/'>
        Reload
      </a>
    </section>
  )
}
