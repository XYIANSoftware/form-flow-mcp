'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { TabView, TabPanel } from 'primereact/tabview'
import { FormField } from '@/types'
import APIIntegration from './APIIntegration'
import WebhookSupport from './WebhookSupport'
import AnalyticsSystem from './AnalyticsSystem'
import ExportOptions from './ExportOptions'

interface APIConnection {
	id: string
	name: string
	url: string
	method: string
	headers: Record<string, string>
	enabled: boolean
}

interface Webhook {
	id: string
	name: string
	url: string
	events: string[]
	enabled: boolean
}

interface AnalyticsConfig {
	trackingEnabled: boolean
	events: string[]
	customMetrics: Record<string, unknown>
}

interface ExportConfig {
	format: string
	includeMetadata: boolean
	filters: Record<string, unknown>
}

interface PowerFeaturesPanelProps {
	fields: FormField[]
	onAPIConnectionsChange: (connections: APIConnection[]) => void
	onWebhooksChange: (webhooks: Webhook[]) => void
	onAnalyticsConfigChange: (config: AnalyticsConfig) => void
	onExport: (config: ExportConfig) => void
	className?: string
}

export default function PowerFeaturesPanel({
	fields,
	onAPIConnectionsChange,
	onWebhooksChange,
	onAnalyticsConfigChange,
	onExport,
	className = '',
}: PowerFeaturesPanelProps) {
	const [activeTab, setActiveTab] = useState(0)
	const [apiConnections, setApiConnections] = useState<APIConnection[]>([])
	const [webhooks, setWebhooks] = useState<Webhook[]>([])
	// const [analyticsConfig] = useState<AnalyticsConfig>({ trackingEnabled: false, events: [], customMetrics: {} })

	const handleAPIConnectionsChange = useCallback(
		(connections: APIConnection[]) => {
			setApiConnections(connections)
			onAPIConnectionsChange(connections)
		},
		[onAPIConnectionsChange]
	)

	const handleWebhooksChange = useCallback(
		(webhooks: Webhook[]) => {
			setWebhooks(webhooks)
			onWebhooksChange(webhooks)
		},
		[onWebhooksChange]
	)

	const handleAnalyticsConfigChange = useCallback(
		(config: AnalyticsConfig) => {
			setAnalyticsConfig(config)
			onAnalyticsConfigChange(config)
		},
		[onAnalyticsConfigChange]
	)

	const handleExport = useCallback(
		(config: ExportConfig) => {
			onExport(config)
		},
		[onExport]
	)

	return (
		<Card className={`h-full ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-bolt text-purple-400' />
						<h3 className='text-sm font-medium text-white'>Power Features</h3>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-xs text-gray-400'>
							{apiConnections.length} APIs, {webhooks.length} webhooks
						</span>
					</div>
				</div>
			</div>

			<div className='p-0'>
				<TabView
					activeIndex={activeTab}
					onTabChange={e => setActiveTab(e.index)}
					className='power-features-tabs'
				>
					<TabPanel header='API Integration' leftIcon='pi pi-cloud'>
						<div className='p-4'>
							<APIIntegration
								fields={fields}
								onConnectionsChange={handleAPIConnectionsChange}
							/>
						</div>
					</TabPanel>

					<TabPanel header='Webhooks' leftIcon='pi pi-send'>
						<div className='p-4'>
							<WebhookSupport onWebhooksChange={handleWebhooksChange} />
						</div>
					</TabPanel>

					<TabPanel header='Analytics' leftIcon='pi pi-chart-bar'>
						<div className='p-4'>
							<AnalyticsSystem
								fields={fields}
								onConfigChange={handleAnalyticsConfigChange}
							/>
						</div>
					</TabPanel>

					<TabPanel header='Export' leftIcon='pi pi-download'>
						<div className='p-4'>
							<ExportOptions fields={fields} onExport={handleExport} />
						</div>
					</TabPanel>

					<TabPanel header='Templates' leftIcon='pi pi-file'>
						<div className='p-4'>
							<div className='text-center py-8 text-gray-400'>
								<i className='pi pi-file text-2xl mb-2' />
								<div>Template Library</div>
								<div className='text-sm'>Save and share form templates</div>
							</div>
						</div>
					</TabPanel>

					<TabPanel header='Collaboration' leftIcon='pi pi-users'>
						<div className='p-4'>
							<div className='text-center py-8 text-gray-400'>
								<i className='pi pi-users text-2xl mb-2' />
								<div>Team Collaboration</div>
								<div className='text-sm'>Work together on form creation</div>
							</div>
						</div>
					</TabPanel>

					<TabPanel header='Accessibility' leftIcon='pi pi-universal-access'>
						<div className='p-4'>
							<div className='text-center py-8 text-gray-400'>
								<i className='pi pi-universal-access text-2xl mb-2' />
								<div>Accessibility Features</div>
								<div className='text-sm'>
									WCAG compliance and accessibility tools
								</div>
							</div>
						</div>
					</TabPanel>

					<TabPanel header='Performance' leftIcon='pi pi-cog'>
						<div className='p-4'>
							<div className='text-center py-8 text-gray-400'>
								<i className='pi pi-cog text-2xl mb-2' />
								<div>Performance Optimization</div>
								<div className='text-sm'>
									Optimize form performance and caching
								</div>
							</div>
						</div>
					</TabPanel>
				</TabView>
			</div>
		</Card>
	)
}
