"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RewardTierForm } from "@/components/admin/reward-tier-form"
import { RewardTierList } from "@/components/admin/reward-tier-list"
import { Trophy, PlusCircle } from "lucide-react"

export function RewardTiers() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list" className="flex items-center">
            <Trophy className="mr-2 h-4 w-4" />
            Reward Tiers
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Tier
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-4">
          <RewardTierList />
        </TabsContent>
        
        <TabsContent value="add" className="mt-4">
          <RewardTierForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
