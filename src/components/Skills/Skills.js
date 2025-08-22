"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./Skills.module.css";
import Link from "next/link";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      setLoading(true);

      const { data, error } = await supabase
        .from("project_skills")
        .select(`
          skills (
            id,
            name,
            type,
            link
          )
        `);

      if (error) {
        console.error("Erreur chargement compétences :", error);
        setLoading(false);
        return;
      }

      const usedSkills = data.map((row) => row.skills);

      const uniqueSkills = [
        ...new Map(usedSkills.map((s) => [s.id, s])).values(),
      ];

      const filtered = uniqueSkills.filter(
        (s) => s?.type && String(s.type).trim() !== ""
      );

      setSkills(filtered);
      setLoading(false);
    }

    fetchSkills();
  }, []);

  if (loading) return <p>Chargement...</p>;

  const skillsByType = skills.reduce((acc, s) => {
    if (!acc[s.type]) acc[s.type] = [];
    acc[s.type].push(s);
    return acc;
  }, {});

  return (
    <section className={styles.skills} id="skills">
      <div className={styles.text}>
        <h2 className={styles.title}>Mes compétences</h2>
        <p className={styles.subtitle}>
          Voici quelques compétences issues de mes projets, formations ou
          expériences. Découvrez-en plus dans mon&nbsp;
          <Link href="/projects" className={styles.link}>
            bac à sable
          </Link>.
        </p>
      </div>

      <div className={styles.columnsContainer}>
        {Object.entries(skillsByType).map(([type, group]) => (
          <div key={type} className={styles.column}>
            <h3 className={styles.typeTitle}>{type}</h3>
            {group.map((skill) => (
              <div key={skill.id} className={styles.skillItem}>
                {skill.link && (
                  <img
                    src={skill.link}
                    alt={skill.name}
                    className={styles.skillIcon}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    loading="lazy"
                  />
                )}
                <p className={styles.skillName}>{skill.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
