import { useMemo, useState, useRef, useEffect } from 'react'
import './Users.css'
import Table from '../../components/Table/Table'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import Pagination from '../../components/Pagination/Pagination'
import Modal from '../../components/Modal/Modal'

const makeMockUsers = (n = 50) => {
  const roles = ['Admin', 'Manager', 'User']
  return Array.from({ length: n }).map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: i % 5 === 0 ? 'Disabled' : 'Active',
    lastLogin: `${Math.max(1, (i % 28) + 1)}/02/2026`,
  }))
}

const defaultColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'lastLogin', label: 'Last Login' },
]

const Users = () => {
  const [users] = useState(() => makeMockUsers(1000))
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [columnsVisible, setColumnsVisible] = useState(() =>
    defaultColumns.reduce((acc, c) => ({ ...acc, [c.key]: true }), {})
  )
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false)
  const [rowActionOpen, setRowActionOpen] = useState(null) // id of row with open action popup
  const [rowActionAnchor, setRowActionAnchor] = useState(null)
  const [rowActionStyle, setRowActionStyle] = useState(null)
  const tableWrapRef = useRef(null)
  const popupRef = useRef(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }, [users, search])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const toggleRow = (id) => {
    const s = new Set(selectedRows)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    setSelectedRows(s)
  }

  const toggleSelectAll = (checked) => {
    if (checked) {
      const s = new Set(pageData.map((r) => r.id))
      setSelectedRows(s)
    } else {
      setSelectedRows(new Set())
    }
  }

  const visibleColumns = defaultColumns.filter((c) => columnsVisible[c.key])

  const highlightText = (text = '', q = '') => {
    if (!q) return text
    const parts = String(text).split(new RegExp(`(${q.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <span key={i} className="highlight">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  const columnsForTable = [
    {
      key: '__select',
      label: (
        <input
          type="checkbox"
          checked={pageData.length > 0 && pageData.every((r) => selectedRows.has(r.id))}
          onChange={(e) => toggleSelectAll(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      width: '48px',
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.id)}
          onChange={() => toggleRow(row.id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    ...visibleColumns.map((c) => ({
      key: c.key,
      label: c.label,
      render: (val, row) => {
        // highlight only for name and email (and for any string cell)
        if (typeof val === 'string') return highlightText(val, search)
        return val
      },
    })),
    {
      key: '__actions',
      label: 'Actions',
      width: '48px',
      render: (_, row) => (
        <button
          className="table-action-btn"
          onClick={(e) => {
            e.stopPropagation()
            // toggle popup for same row
            if (rowActionOpen === row.id) {
              setRowActionOpen(null)
              setRowActionAnchor(null)
              setRowActionStyle(null)
              return
            }
            // open popup anchored to this button, positioned relative to table container
            const btn = e.currentTarget
            const rect = btn.getBoundingClientRect()
            const container = tableWrapRef.current
            if (!container) return
            
            const containerRect = container.getBoundingClientRect()
            
            // compute position relative to container (accounting for scroll)
            const estimatedW = 160
            const estimatedH = 120
            const margin = 8
            
            let left = rect.left - containerRect.left + container.scrollLeft - estimatedW - margin
            if (left < margin) left = rect.right - containerRect.left + container.scrollLeft + margin
            
            let top = rect.bottom - containerRect.top + container.scrollTop + 6
            const maxTop = container.clientHeight - estimatedH - margin
            if (top - container.scrollTop > maxTop) top = container.scrollTop + Math.max(margin, maxTop)
            
            setRowActionAnchor({ rect, container, containerRect })
            setRowActionStyle({ position: 'absolute', top: top + 'px', left: left + 'px' })
            setRowActionOpen(row.id)
          }}
          aria-label="Row actions"
        >
          {/* SVG three-dots vertical */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </button>
      ),
    },
  ]

  // close popup when clicking outside
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!rowActionOpen) return
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setRowActionOpen(null)
      }
    }
    document.addEventListener('mousedown', handleDocClick)
    return () => document.removeEventListener('mousedown', handleDocClick)
  }, [rowActionOpen])

  // refine popup position based on actual popup size once mounted
  useEffect(() => {
    if (!rowActionOpen || !rowActionAnchor || !popupRef.current) {
      return
    }

    const { rect, container, containerRect } = rowActionAnchor
    const popup = popupRef.current
    const pw = popup.offsetWidth || 160
    const ph = popup.offsetHeight || 120
    const margin = 8

    // prefer left of button (relative to container)
    let left = rect.left - containerRect.left + container.scrollLeft - pw - margin
    // if not enough space on left, place to right
    if (left < margin) left = rect.right - containerRect.left + container.scrollLeft + margin

    // top below button (relative to container)
    let top = rect.bottom - containerRect.top + container.scrollTop + 6
    const maxTop = container.clientHeight - ph - margin
    if (top - container.scrollTop > maxTop) top = container.scrollTop + Math.max(margin, maxTop)

    setRowActionStyle({ position: 'absolute', top: top + 'px', left: left + 'px' })
  }, [rowActionOpen, rowActionAnchor])

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>Users</h1>
        <div className="users-actions">
          <Button variant="secondary" size="md">Filter</Button>
          <Button variant="primary" size="md">Add User</Button>
          {selectedRows.size >= 2 && (
            <Button variant="danger" size="md" onClick={() => setSelectedRows(new Set())}>
              Disable ({selectedRows.size})
            </Button>
          )}
          <Button variant="outline" size="md" onClick={() => setIsColumnsModalOpen(true)}>
            Columns
          </Button>
        </div>
      </div>

      <div className="users-table-wrap" ref={tableWrapRef}>
        <div className="table-controls">
          <div className="users-search">
            <Input
              name="usersSearch"
              placeholder="Search users..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            />
          </div>

          <div className="users-pagination">
            <div className="users-range">{`${((currentPage-1)*pageSize)+1} to ${Math.min(currentPage*pageSize, total)} of ${total}`}</div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => setCurrentPage(Math.min(Math.max(1,p), totalPages))} />
          </div>
        </div>

        <Table columns={columnsForTable} data={pageData} />

        {/* Inline row action popup positioned next to the clicked button */}
        {rowActionOpen && rowActionStyle && (
          <div
            ref={popupRef}
            className="row-action-popup"
            style={rowActionStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="row-action-item" onClick={() => { /* edit */ setRowActionOpen(null) }}>Edit</button>
            <button className="row-action-item" onClick={() => { /* disable */ setRowActionOpen(null) }}>Disable</button>
            <button className="row-action-item" onClick={() => { /* lock login */ setRowActionOpen(null) }}>Disable Login</button>
            <button className="row-action-item" onClick={() => { /* change pwd */ setRowActionOpen(null) }}>Change Password</button>
          </div>
        )}
      </div>

      {/* Columns modal */}
      <Modal isOpen={isColumnsModalOpen} onClose={() => setIsColumnsModalOpen(false)} title="Select Columns">
        <div className="columns-list">
          {defaultColumns.map((c) => (
            <label key={c.key} className="columns-item">
              <input
                type="checkbox"
                checked={!!columnsVisible[c.key]}
                onChange={(e) => setColumnsVisible({ ...columnsVisible, [c.key]: e.target.checked })}
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
        <div className="modal-footer-actions">
          <Button variant="secondary" onClick={() => setIsColumnsModalOpen(false)}>Close</Button>
        </div>
      </Modal>

      {/* Row-action modal removed: using inline popup next to action button */}
    </div>
  )
}

export default Users
