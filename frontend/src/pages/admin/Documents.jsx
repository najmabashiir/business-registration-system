import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  ExternalLink,
  FileText,
  Loader2,
  RefreshCcw,
  Search,
} from "lucide-react"

import { getAllBusinesses } from "@/api/adminApi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const SERVER_URL = API_BASE_URL.replace("/api/v1", "").replace("/api", "")

function formatDate(date) {
  if (!date) return "N/A"

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getDocumentUrl(filePath) {
  if (!filePath) return "#"

  const normalizedPath = filePath.replaceAll("\\", "/")

  if (normalizedPath.startsWith("http")) {
    return normalizedPath
  }

  const uploadsIndex = normalizedPath.indexOf("uploads/")
  const relativePath =
    uploadsIndex >= 0
      ? normalizedPath.slice(uploadsIndex)
      : `uploads/${normalizedPath}`

  return `${SERVER_URL}/${relativePath}`
}

function getStatusClass(status) {
  if (status === "Approved") {
    return "bg-green-100 text-green-700 hover:bg-green-100"
  }

  if (status === "Rejected") {
    return "bg-red-100 text-red-700 hover:bg-red-100"
  }

  return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
}

function AdminDocuments() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchBusinesses = async () => {
    try {
      setLoading(true)
      const data = await getAllBusinesses()
      setBusinesses(data.businesses || [])
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load documents"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const documents = useMemo(() => {
    return businesses.flatMap((business) => {
      const docs = business.documents || []

      return docs.map((document, index) => ({
        id: `${business._id}-${index}`,
        businessName: business.businessName,
        registrationNumber: business.registrationNumber,
        businessStatus: business.status || "Pending",
        ownerName: business.owner?.fullName || "Unknown Owner",
        ownerEmail: business.owner?.email || "No email",
        fileName: document.fileName || document.originalName || "Document",
        filePath: document.filePath,
        uploadedAt: document.uploadedAt || document.createdAt || business.createdAt,
      }))
    })
  }, [businesses])

  const filteredDocuments = documents.filter((document) => {
    const keyword = search.toLowerCase()

    return (
      document.businessName?.toLowerCase().includes(keyword) ||
      document.ownerName?.toLowerCase().includes(keyword) ||
      document.fileName?.toLowerCase().includes(keyword) ||
      document.registrationNumber?.toLowerCase().includes(keyword)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Documents
          </h1>
          <p className="text-muted-foreground mt-1">
            Review documents uploaded by business owners.
          </p>
        </div>

        <Button variant="outline" onClick={fetchBusinesses} disabled={loading}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Businesses With Docs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                businesses.filter(
                  (business) => business.documents?.length > 0
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                documents.filter(
                  (document) => document.businessStatus === "Pending"
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            Open documents to review business registration evidence.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by business, owner, file, or registration no."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <FileText className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-semibold">
                No documents uploaded yet
              </h3>

              <p className="text-muted-foreground mt-1 max-w-sm">
                When owners register businesses and upload documents, they will
                appear here.
              </p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <p className="text-muted-foreground">
              No documents match your search.
            </p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="min-w-[130px]">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">
                            {document.fileName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {document.businessName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {document.registrationNumber || "No registration no."}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {document.ownerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {document.ownerEmail}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={getStatusClass(document.businessStatus)}>
                          {document.businessStatus}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {formatDate(document.uploadedAt)}
                      </TableCell>

                      <TableCell>
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={getDocumentUrl(document.filePath)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDocuments