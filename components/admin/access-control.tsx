"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { UserPlus, Trash2, ShieldCheck } from "lucide-react"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"

interface AdminUser {
  id: string
  address: string
  name: string
  role: string
  dateAdded: string
}

// Mock admin users data
const mockAdminUsers: AdminUser[] = [
  {
    id: "1",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    name: "Main Admin",
    role: "Owner",
    dateAdded: "2023-01-15",
  },
  {
    id: "2",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    name: "Product Manager",
    role: "Admin",
    dateAdded: "2023-03-22",
  },
  {
    id: "3",
    address: "0x7890abcdef1234567890abcdef1234567890abcd",
    name: "Store Manager",
    role: "Admin",
    dateAdded: "2023-05-10",
  },
]

export function AccessControl() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers)
  const [newAdmin, setNewAdmin] = useState({ address: "", name: "" })
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate address format (simple check for demo)
    if (!newAdmin.address.startsWith("0x") || newAdmin.address.length !== 42) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Starknet wallet address.",
        variant: "destructive",
      })
      return
    }

    // Check if address already exists
    if (adminUsers.some((user) => user.address.toLowerCase() === newAdmin.address.toLowerCase())) {
      toast({
        title: "Address already exists",
        description: "This wallet address is already an admin.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would call the Starknet contract to add the admin
    const newAdminUser: AdminUser = {
      id: Date.now().toString(),
      address: newAdmin.address,
      name: newAdmin.name || `Admin ${adminUsers.length + 1}`,
      role: "Admin",
      dateAdded: new Date().toISOString().split("T")[0],
    }

    setAdminUsers([...adminUsers, newAdminUser])
    setNewAdmin({ address: "", name: "" })

    toast({
      title: "Admin added",
      description: `${newAdminUser.name} has been added as an admin.`,
    })
  }

  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    // In a real app, you would call the Starknet contract to remove the admin
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (userToDelete) {
          setAdminUsers(adminUsers.filter((user) => user.id !== userToDelete.id))
          toast({
            title: "Admin removed",
            description: `${userToDelete.name} has been removed from admins.`,
          })
        }
        resolve()
      }, 1000)
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Admin</CardTitle>
          <CardDescription>
            Add a new admin user who can manage products and access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Wallet Address</Label>
                <Input
                  id="address"
                  placeholder="0x..."
                  value={newAdmin.address}
                  onChange={(e) => setNewAdmin({ ...newAdmin, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="Product Manager"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>Manage users who have admin access to the store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {user.role === "Owner" && <ShieldCheck className="h-4 w-4 text-primary" />}
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.dateAdded}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteClick(user)}
                      disabled={user.role === "Owner"} // Can't delete the owner
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteConfirmation
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={userToDelete?.name || "this admin"}
      />
    </div>
  )
}
