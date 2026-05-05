import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface User {
  UserId: string
  UserAcc: string
  UserChtName: string
  UserEngName: string
  UserEmail: string
  UserDeptId: string
  UserGroupId: string
  LOCK: string
  PwdChange: string
}

const empty = { UserAcc: '', UserChtName: '', UserEngName: '', UserEmail: '', UserDeptId: '', UserGroupId: '', Password: '' }

export default function UserPage() {
  const [rows, setRows] = useState<User[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...empty })

  const load = async () => {
    const res = await api.get('/user')
    setRows(res.data.data)
  }

  useEffect(() => { load() }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => { setEditId(null); setForm({ ...empty }); setOpen(true) }
  const openEdit = (u: User) => {
    setEditId(u.UserId)
    setForm({ UserAcc: u.UserAcc, UserChtName: u.UserChtName, UserEngName: u.UserEngName, UserEmail: u.UserEmail, UserDeptId: u.UserDeptId, UserGroupId: u.UserGroupId, Password: '' })
    setOpen(true)
  }

  const save = async () => {
    try {
      if (editId) {
        await api.put(`/user/${editId}`, form)
        toast.success('更新成功')
      } else {
        await api.post('/user', form)
        toast.success('新增成功')
      }
      setOpen(false)
      load()
    } catch {
      toast.error('操作失敗')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('確定刪除？')) return
    await api.delete(`/user/${id}`)
    toast.success('刪除成功')
    load()
  }

  const toggleLock = async (u: User) => {
    const next = u.LOCK === 'Y' ? 'N' : 'Y'
    await api.patch(`/user/${u.UserId}/lock?locked=${next}`)
    toast.success(next === 'Y' ? '已鎖定' : '已解鎖')
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">人事資料</h1>
        <Button onClick={openAdd}>新增</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>帳號</TableHead>
            <TableHead>中文姓名</TableHead>
            <TableHead>英文姓名</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>部門</TableHead>
            <TableHead>群組</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(u => (
            <TableRow key={u.UserId}>
              <TableCell>{u.UserAcc}</TableCell>
              <TableCell>{u.UserChtName}</TableCell>
              <TableCell>{u.UserEngName}</TableCell>
              <TableCell>{u.UserEmail}</TableCell>
              <TableCell>{u.UserDeptId}</TableCell>
              <TableCell>{u.UserGroupId}</TableCell>
              <TableCell>
                <Button variant={u.LOCK === 'Y' ? 'destructive' : 'outline'} size="sm" onClick={() => toggleLock(u)}>
                  {u.LOCK === 'Y' ? '已鎖定' : '正常'}
                </Button>
              </TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(u)}>編輯</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(u.UserId)}>刪除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? '編輯使用者' : '新增使用者'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {!editId && (
              <div className="space-y-1">
                <Label>帳號</Label>
                <Input value={form.UserAcc} onChange={e => set('UserAcc', e.target.value)} />
              </div>
            )}
            <div className="space-y-1">
              <Label>中文姓名</Label>
              <Input value={form.UserChtName} onChange={e => set('UserChtName', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>英文姓名</Label>
              <Input value={form.UserEngName} onChange={e => set('UserEngName', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={form.UserEmail} onChange={e => set('UserEmail', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>部門</Label>
              <Input value={form.UserDeptId} onChange={e => set('UserDeptId', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>群組</Label>
              <Input value={form.UserGroupId} onChange={e => set('UserGroupId', e.target.value)} />
            </div>
            {!editId && (
              <div className="space-y-1">
                <Label>初始密碼</Label>
                <Input type="password" value={form.Password} onChange={e => set('Password', e.target.value)} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={save}>儲存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
