import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface Param { ParamId: string; TypeId: string; ParamName: string; ParamValue: string; SortNo: number }
interface XpType { TypeId: string; TypeName: string }

const empty = { TypeId: '', ParamName: '', ParamValue: '', SortNo: 0 }

export default function ParamPage() {
  const [rows, setRows] = useState<Param[]>([])
  const [types, setTypes] = useState<XpType[]>([])
  const [filterType, setFilterType] = useState('')
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...empty })

  const loadTypes = async () => {
    const res = await api.get('/type')
    setTypes(res.data.data)
  }

  const load = async (typeId?: string) => {
    const url = typeId ? `/param?typeId=${typeId}` : '/param'
    const res = await api.get(url)
    setRows(res.data.data)
  }

  useEffect(() => { loadTypes(); load() }, [])

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => { setEditId(null); setForm({ ...empty }); setOpen(true) }
  const openEdit = (p: Param) => {
    setEditId(p.ParamId)
    setForm({ TypeId: p.TypeId, ParamName: p.ParamName, ParamValue: p.ParamValue, SortNo: p.SortNo })
    setOpen(true)
  }

  const save = async () => {
    try {
      if (editId) {
        await api.put(`/param/${editId}`, form)
        toast.success('更新成功')
      } else {
        await api.post('/param', form)
        toast.success('新增成功')
      }
      setOpen(false)
      load(filterType || undefined)
    } catch {
      toast.error('操作失敗')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('確定刪除？')) return
    await api.delete(`/param/${id}`)
    toast.success('刪除成功')
    load(filterType || undefined)
  }

  const handleFilter = (v: string | null) => {
    const val = v ?? ''
    setFilterType(val === 'all' ? '' : val)
    load(val === 'all' ? undefined : val || undefined)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">下拉選單</h1>
          <Select onValueChange={handleFilter} defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="篩選代碼" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {types.map(t => (
                <SelectItem key={t.TypeId} value={t.TypeId}>{t.TypeName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAdd}>新增</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>代碼類別</TableHead>
            <TableHead>名稱</TableHead>
            <TableHead>值</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(p => (
            <TableRow key={p.ParamId}>
              <TableCell>{p.TypeId}</TableCell>
              <TableCell>{p.ParamName}</TableCell>
              <TableCell>{p.ParamValue}</TableCell>
              <TableCell>{p.SortNo}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)}>編輯</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(p.ParamId)}>刪除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? '編輯參數' : '新增參數'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>代碼類別</Label>
              <Select value={form.TypeId} onValueChange={v => set('TypeId', v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇類別" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(t => (
                    <SelectItem key={t.TypeId} value={t.TypeId}>{t.TypeName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>名稱</Label>
              <Input value={form.ParamName} onChange={e => set('ParamName', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>值</Label>
              <Input value={form.ParamValue} onChange={e => set('ParamValue', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>排序</Label>
              <Input type="number" value={form.SortNo} onChange={e => set('SortNo', Number(e.target.value))} />
            </div>
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
