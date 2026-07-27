import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Alert } from '../feedback/Alert'
import { ArrowRight } from 'lucide-react'

interface PortalCardProps {
  role: 'admin' | 'mitra'
  title: string
  subtitle: string
  description: string
  noticeTitle: string
  noticeText: React.ReactNode
  primaryActionText: string
  primaryActionUrl: string
  secondaryActionText?: string
  secondaryActionUrl?: string
}

export const PortalCard: React.FC<PortalCardProps> = ({
  role,
  title,
  subtitle,
  description,
  noticeTitle,
  noticeText,
  primaryActionText,
  primaryActionUrl,
  secondaryActionText,
  secondaryActionUrl
}) => {
  const isWarning = role === 'admin'

  return (
    <Card hoverable style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Badge variant={isWarning ? 'warning' : 'info'}>Portal {role.toUpperCase()}</Badge>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>{subtitle}</span>
        </div>

        <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.75rem' }}>{title}</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {description}
        </p>

        <Alert type={isWarning ? 'warning' : 'info'} title={noticeTitle}>
          {noticeText}
        </Alert>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Link to={primaryActionUrl} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {primaryActionText} <ArrowRight size={16} />
        </Link>
        {secondaryActionText && secondaryActionUrl && (
          <Link to={secondaryActionUrl} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
            {secondaryActionText}
          </Link>
        )}
      </div>
    </Card>
  )
}
