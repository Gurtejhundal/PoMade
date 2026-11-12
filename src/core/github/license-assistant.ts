export interface LicenseOption {
  spdxId: string;
  name: string;
  type: 'permissive' | 'copyleft' | 'public-domain';
  summary: string;
  recommendedFor: string;
}

export class LicenseAssistant {
  public static getOptions(): LicenseOption[] {
    return [
      {
        spdxId: 'MIT',
        name: 'MIT License',
        type: 'permissive',
        summary: 'Simple and permissive; allows reuse, modification, and distribution with minimal restrictions.',
        recommendedFor: 'Libraries, CLI tools, and modern open-source utilities.',
      },
      {
        spdxId: 'Apache-2.0',
        name: 'Apache License 2.0',
        type: 'permissive',
        summary: 'Permissive with explicit grant of patent rights and contributor trademark protections.',
        recommendedFor: 'Enterprise software, frameworks, and larger open-source ecosystems.',
      },
      {
        spdxId: 'BSD-3-Clause',
        name: 'BSD 3-Clause License',
        type: 'permissive',
        summary: 'Permissive license with a specific clause prohibiting endorsement without written permission.',
        recommendedFor: 'Academic and scientific codebases.',
      },
      {
        spdxId: 'GPL-3.0',
        name: 'GNU General Public License v3.0',
        type: 'copyleft',
        summary: 'Strong copyleft; requires derivative works and modified distributions to also be open-source under GPL.',
        recommendedFor: 'Standalone applications where community freedom must be preserved.',
      },
      {
        spdxId: 'Unlicense',
        name: 'The Unlicense',
        type: 'public-domain',
        summary: 'Dedicated to the public domain; waives copyright interests worldwide.',
        recommendedFor: 'Public domain snippets, educational examples, and uncopyrighted templates.',
      },
    ];
  }

  public static generateNotice(spdxId: string, author: string, year = new Date().getFullYear()): string {
    const cleanAuthor = author.trim() || '<year> <copyright holders>';
    switch (spdxId) {
      case 'MIT':
        return `MIT License\n\nCopyright (c) ${year} ${cleanAuthor}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.`;
      case 'Apache-2.0':
        return `Copyright ${year} ${cleanAuthor}\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.`;
      case 'Unlicense':
        return `This is free and unencumbered software released into the public domain.\n\nAnyone is free to copy, modify, publish, use, compile, sell, or\ndistribute this software, either in source code form or as a compiled\nbinary, for any purpose, commercial or non-commercial, and by any means.`;
      default:
        return `Copyright (c) ${year} ${cleanAuthor}.\nLicensed under the ${spdxId} License.`;
    }
  }
}
