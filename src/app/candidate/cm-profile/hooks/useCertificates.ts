import { useState } from 'react';
import { Certificate } from '../components/types';
import { addCertificate, updateCertificate, deleteCertificate, type CertificateData } from '@/lib/resume-api';
import toast from 'react-hot-toast';

export function useCertificates(resumeId: number | null) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  const openCertDialog = (cert?: Certificate) => {
    if (cert) {
      setEditingCert(cert);
    } else {
      setEditingCert({
        id: '0',
        name: '',
        org: '',
        month: '',
        year: '',
        url: '',
        desc: ''
      });
    }
    setIsCertDialogOpen(true);
  };

  const saveCertificate = async () => {
    if (!editingCert || !editingCert.name || !editingCert.org || !editingCert.month || !editingCert.year) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    try {
      const certData: CertificateData = {
        resumeId,
        name: editingCert.name,
        organization: editingCert.org,
        getDate: `${editingCert.year}-${editingCert.month}-15`,
        ...(editingCert.url && { certificateUrl: editingCert.url }),
        ...(editingCert.desc && { description: editingCert.desc })
      };

      if (editingCert.id && editingCert.id !== '0') {
        await updateCertificate(resumeId, Number(editingCert.id), certData);
        setCertificates(certificates.map(cert =>
          cert.id === editingCert.id ? editingCert : cert
        ));
        toast.success("Certificate updated successfully!");
      } else {
        const result = await addCertificate(certData);
        const newCert: Certificate = {
          id: result.certificateId.toString(),
          name: result.name,
          org: result.organization,
          month: editingCert.month,
          year: editingCert.year,
          url: result.certificateUrl || editingCert.url,
          desc: result.description || editingCert.desc
        };
        setCertificates([...certificates, newCert]);
        toast.success("Certificate added successfully!");
      }

      setIsCertDialogOpen(false);
      setEditingCert(null);
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast.error("Failed to save certificate. Please try again.");
    }
  };

  const removeCertificate = async (id: string) => {
    try {
      await deleteCertificate(Number(id));
      setCertificates(certificates.filter(cert => cert.id !== id));
      toast.success("Certificate removed successfully!");
    } catch (error) {
      console.error("Error removing certificate:", error);
      toast.error("Failed to remove certificate. Please try again.");
    }
  };

  return {
    certificates,
    setCertificates,
    isCertDialogOpen,
    setIsCertDialogOpen,
    editingCert,
    setEditingCert,
    openCertDialog,
    saveCertificate,
    removeCertificate
  };
}
