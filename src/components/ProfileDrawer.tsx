import React, { useState } from 'react';
import { X, GraduationCap, Code2, FolderGit2, Award, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { SARANYA_PROFILE, ProjectItem } from '../data/profile';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutProject: (projectTitle: string) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  onAskAboutProject,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills' | 'experience'>('overview');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-full bg-[#0a0d18] border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/80 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-purple-500/30 bg-slate-800 shrink-0">
              <img
                src="/src/assets/images/saranya_portrait_1794014759640.jpg"
                alt="Saranya Gadde"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Verified Candidate Knowledge Base</span>
              </div>
              <h2 className="text-xl font-bold text-white">{SARANYA_PROFILE.name}</h2>
              <p className="text-xs text-slate-300">{SARANYA_PROFILE.role} · B.Tech AI & ML (2026)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-6 gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: GraduationCap },
            { id: 'projects', label: 'Projects (5)', icon: FolderGit2 },
            { id: 'skills', label: 'Tech Skills', icon: Code2 },
            { id: 'experience', label: 'Internships', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 px-3 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Education Card */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-400">
                    <GraduationCap className="w-5 h-5" />
                    <h3 className="text-sm font-bold text-white">Undergraduate Education</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-800/40 text-purple-300">
                    CGPA: {SARANYA_PROFILE.education.cgpa}
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white text-sm">
                    {SARANYA_PROFILE.education.degree}
                  </p>
                  <p className="text-slate-300">
                    {SARANYA_PROFILE.education.institution}
                  </p>
                  <p className="text-slate-400">
                    {SARANYA_PROFILE.education.affiliation} · Graduating in {SARANYA_PROFILE.education.graduationYear}
                  </p>
                </div>
              </div>

              {/* Assessment Context */}
              <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-2.5">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  100x AI Engineer Candidate Profile
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This interactive digital twin embodies Saranya Gadde&apos;s genuine engineering journey. Every answer is grounded directly in her academic and project achievements without embellishments, reflecting her enthusiasm, technical clarity, and problem-solving mindset.
                </p>
              </div>

              {/* Quick Project Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Featured Core Projects
                </h4>
                <div className="space-y-2.5">
                  {SARANYA_PROFILE.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{proj.title}</p>
                        <p className="text-[11px] text-slate-400">{proj.category}</p>
                      </div>
                      <button
                        onClick={() => {
                          onAskAboutProject(proj.title);
                          onClose();
                        }}
                        className="text-xs text-purple-400 hover:text-purple-300 font-medium px-2 py-1 rounded bg-purple-950/30 border border-purple-800/30"
                      >
                        Ask Twin →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Detailed architecture and accomplishments across all 5 engineering projects:
              </p>
              {SARANYA_PROFILE.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">
                        {proj.category}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{proj.title}</h3>
                    </div>
                    <button
                      onClick={() => {
                        onAskAboutProject(proj.title);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg shrink-0 transition-colors"
                    >
                      Ask in Voice
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1">
                    {proj.keyHighlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-5">
              {[
                { title: 'Programming Languages', list: SARANYA_PROFILE.skills.programming },
                { title: 'AI & Machine Learning', list: SARANYA_PROFILE.skills.ai_ml },
                { title: 'Frameworks & Libraries', list: SARANYA_PROFILE.skills.frameworks },
                { title: 'Computer Vision', list: SARANYA_PROFILE.skills.computerVision },
                { title: 'Databases', list: SARANYA_PROFILE.skills.databases },
                { title: 'Web Development', list: SARANYA_PROFILE.skills.webDev },
                { title: 'Developer Tools', list: SARANYA_PROFILE.skills.tools },
              ].map((group) => (
                <div key={group.title} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2.5">
                    {group.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.list.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-xs font-medium text-slate-200 border border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Virtual Internships
                </h4>
                <div className="space-y-3">
                  {SARANYA_PROFILE.internships.map((intern, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-white">{intern.title}</h5>
                        <span className="text-[10px] text-purple-400 font-medium">{intern.organization}</span>
                      </div>
                      {intern.collaboration && (
                        <p className="text-[11px] text-indigo-300">
                          In collaboration with {intern.collaboration}
                        </p>
                      )}
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {intern.learnings.map((l, j) => (
                          <li key={j}>{l}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Certifications & Training
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SARANYA_PROFILE.certifications.map((cert, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <h5 className="text-xs font-bold text-white">{cert.title}</h5>
                      <p className="text-[11px] text-purple-400 mt-0.5">{cert.issuer}</p>
                      <p className="text-xs text-slate-400 mt-1">{cert.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span>Profile verified for 100x assessment</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
