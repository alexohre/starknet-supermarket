"use client"

import React, { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { UserPlus, Trash2, ShieldCheck } from "lucide-react"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { useContract, useSendTransaction, useReadContract, useTransactionReceipt } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { shortString } from "starknet"

interface AdminUser {
  id: string
  address: string
  name: string
  role: string
  dateAdded: string
}

export function AccessControl() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [adminNames, setAdminNames] = useState<Record<string, string>>({})
  const [newAdmin, setNewAdmin] = useState({ address: "", name: "" })
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Starknet contract integration
  const { contract } = useContract({ address: SUPERMARKET_CONTRACT_ADDRESS, abi: SUPERMARKET_ABI as any })
  const { sendAsync: sendAddAdmin } = useSendTransaction({ calls: [] })
  const [transactionHashAdd, setTransactionHashAdd] = useState<string>("")
  const { data: receiptAdd } = useTransactionReceipt({ hash: transactionHashAdd, watch: true })
  const { sendAsync: sendRemoveAdmin } = useSendTransaction({ calls: [] })
  const [transactionHashRemove, setTransactionHashRemove] = useState<string>("")
  const { data: receiptRemove } = useTransactionReceipt({ hash: transactionHashRemove, watch: true })
  const { data: adminsData, isLoading: isLoadingAdmins, refetch: refetchAdmins } = useReadContract({
    functionName: "get_admins",
    args: [],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
    watch: false,
  })
  const { data: ownerData, isLoading: isLoadingOwner, refetch: refetchOwner } = useReadContract({
    functionName: "get_owner",
    args: [],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
    watch: false,
  })

  // Sync on-chain admin list
  useEffect(() => {
    if (ownerData !== undefined && adminsData && Array.isArray(adminsData)) {
      // Helper to convert raw contract address to hex string
      const parseAddr = (raw: any): string => {
        if (typeof raw === 'string') {
          return raw.startsWith('0x')
            ? raw
            : `0x${BigInt(raw).toString(16)}`;
        }
        if (typeof raw === 'bigint') {
          return `0x${raw.toString(16)}`;
        }
        return String(raw);
      };

      const ownerAddr = parseAddr(ownerData);
      // Convert and filter out zero and owner addresses
      const parsedAdmins = (adminsData as any[]).map((addr: any) => parseAddr(addr));
      const validAdmins = parsedAdmins.filter((addr) => addr !== '0x0');
      const otherAdmins = validAdmins.filter((addr) => addr !== ownerAddr);

      const users = [
        { id: ownerAddr, address: ownerAddr, name: adminNames[ownerAddr] || '', role: 'Owner', dateAdded: '-' },
        ...otherAdmins.map((addr) => ({ id: addr, address: addr, name: adminNames[addr] || '', role: 'Admin', dateAdded: '-' })),
      ];
      setAdminUsers(users);
    }
  }, [adminsData, ownerData, adminNames])

  // Handle add admin receipt
  useEffect(() => {
    if (receiptAdd && transactionHashAdd) {
      toast({ title: "Admin added", description: `${newAdmin.name || newAdmin.address} added` })
      setTransactionHashAdd("")
      refetchAdmins()
      refetchOwner()
      setAdminNames((prev) => ({ ...prev, [newAdmin.address]: newAdmin.name }))
      setNewAdmin({ address: "", name: "" })
    }
  }, [receiptAdd])

  // Handle remove admin receipt
  useEffect(() => {
    if (receiptRemove && transactionHashRemove) {
      toast({ title: "Admin removed", description: `Admin removed` })
      setTransactionHashRemove("")
      refetchAdmins()
      refetchOwner()
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }, [receiptRemove])

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[AccessControl] handleAddAdmin called with address:", newAdmin.address)
    if (!contract) {
      console.error("[AccessControl] contract instance not available")
      toast({ title: "Contract unavailable", description: "Unable to add admin: contract not loaded", variant: "destructive" })
      return
    }
    if (!newAdmin.address.startsWith("0x")) {
      toast({ title: "Invalid address", description: "Please enter a valid Starknet wallet address.", variant: "destructive" })
      return
    }
    try {
      // Prepare add_admin call with hex string address
      const call = await contract.populate("add_admin", [newAdmin.address])
      console.log("[AccessControl] call object:", call)
      const response = await sendAddAdmin([call])
      console.log("[AccessControl] sendAsync response:", response)
      if (response.transaction_hash) setTransactionHashAdd(response.transaction_hash)
    } catch (error: any) {
      console.error(error)
      toast({ title: "Error adding admin", description: error.message, variant: "destructive" })
    }
  }

  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!contract || !userToDelete) return
    try {
      const call = await contract.populate("remove_admin", [userToDelete.address])
      const response = await sendRemoveAdmin([call])
      if (response.transaction_hash) setTransactionHashRemove(response.transaction_hash)
    } catch (error: any) {
      console.error(error)
      toast({ title: "Error removing admin", description: error.message, variant: "destructive" })
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
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
          <form onSubmit={handleAddAdmin} className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <Input
                id="address"
                placeholder="0x..."
                value={newAdmin.address}
                onChange={(e) => setNewAdmin({ ...newAdmin, address: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="h-10 px-4">
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
                <TableHead>Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">
                    {user.address.slice(0, 8)}...{user.address.slice(-8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {user.role === "Owner" && <ShieldCheck className="h-4 w-4 text-primary" /> }{user.role}
                    </div>
                  </TableCell>
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
