"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Navigation } from "@/components/Navigation"
import Layout from "@/components/Layout"

export default function SettingsPage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8">Settings</h2>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

